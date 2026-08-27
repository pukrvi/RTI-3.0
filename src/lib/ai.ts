/**
 * The OpenAI layer.
 *
 * What it is for: understanding a question written the way a citizen would
 * actually say it — in any Indian language, without the name of a scheme or a
 * department in it — and turning that into a routing decision the rest of the
 * app can act on.
 *
 * What it is not allowed to do:
 *   • invent an authority. The model may only choose from ids we send it, and
 *     every id it returns is checked against our own list before it is used.
 *   • be the only answer. The deterministic keyword matcher runs regardless and
 *     is shown next to the model's read, so a citizen always has an explanation
 *     that does not require trusting a model — "matched on: ration card".
 *   • decide anything irreversible. Nothing is filed and no money moves until
 *     the citizen has read the application and pressed the button themselves.
 *
 * With no API key configured the whole layer reports itself unavailable and the
 * app runs on keyword matching alone, which is the state it shipped in first.
 */
import { AUTHORITIES } from "@/data/authorities";
import { secret } from "@/lib/env";

export interface AiRead {
  /** Did a model actually run? Drives the badge the citizen sees. */
  available: boolean;
  scope: "central" | "state" | "unclear";
  /** Ids that exist in our authority list. Anything else is discarded. */
  authorityIds: string[];
  /** A shorter, more answerable version of what they asked. */
  betterQuestion?: string;
  /** The model's view on whether this is likely already published. */
  maybePublished?: boolean;
  /** One short paragraph, in the citizen's language, for the chat thread. */
  reply: string;
  error?: string;
}

const MODEL_DEFAULT = "gpt-4o-mini";

/** Is a model actually wired up? Drives the badge, so it must never lie. */
export async function aiConfigured(): Promise<boolean> {
  return Boolean(await secret("OPENAI_API_KEY"));
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["scope", "authority_ids", "maybe_published", "reply", "better_question"],
  properties: {
    scope: { type: "string", enum: ["central", "state", "unclear"] },
    authority_ids: { type: "array", items: { type: "string" }, maxItems: 3 },
    maybe_published: { type: "boolean" },
    better_question: { type: "string" },
    reply: { type: "string" },
  },
} as const;

function catalogue(): string {
  return AUTHORITIES.map(
    (a) =>
      `${a.id} | ${a.scope} | ${a.name}${a.ministry ? ` (${a.ministry})` : ""} | ${a.subjects
        .slice(0, 10)
        .join(", ")}`,
  ).join("\n");
}

function systemPrompt(languageName: string): string {
  return [
    "You help Indian citizens route a Right to Information (RTI) request.",
    "",
    "You are given a catalogue of public authorities as lines of:",
    "id | scope | name | subjects",
    "",
    "Rules you must follow:",
    "- Choose authority ids ONLY from the catalogue. Never invent an id or a body.",
    "- scope 'central' means the request can be filed on this portal.",
    "- scope 'state' means it cannot: land records, ration cards, police stations,",
    "  driving licences, electricity, municipal services, State schools and district",
    "  hospitals are State subjects. Say so plainly rather than guessing a Central body.",
    "- If the question is too vague to route, use scope 'unclear' and ask ONE short",
    "  clarifying question in the reply. Do not ask for the citizen's identity, their",
    "  reason for asking, or any personal detail: under section 6(2) of the RTI Act no",
    "  reason may be demanded.",
    "- better_question: rewrite their question as a request for records for a named",
    "  period. Keep it in their language. Keep it under 40 words. Never add facts they",
    "  did not give; use a blank like ____ where a date or place is missing.",
    "- maybe_published: true only if this is the kind of aggregate figure a ministry",
    "  routinely publishes.",
    "- reply: two sentences at most, plain language, no jargon, no markdown.",
    "",
    `Write reply and better_question in ${languageName}, in that language's own script.`,
  ].join("\n");
}

/** Non-throwing. Any failure degrades to `available: false`. */
export async function readQuestion(
  question: string,
  languageName: string,
  history: Array<{ role: "user" | "app"; text: string }> = [],
): Promise<AiRead> {
  const key = await secret("OPENAI_API_KEY");
  if (!key) {
    return { available: false, scope: "unclear", authorityIds: [], reply: "" };
  }

  const model = (await secret("OPENAI_MODEL")) ?? MODEL_DEFAULT;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt(languageName) },
          { role: "system", content: `CATALOGUE\n${catalogue()}` },
          ...history.map((turn) => ({
            role: turn.role === "user" ? ("user" as const) : ("assistant" as const),
            content: turn.text,
          })),
          { role: "user", content: question },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "rti_routing", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!response.ok) {
      return {
        available: false,
        scope: "unclear",
        authorityIds: [],
        reply: "",
        error: `openai_${response.status}`,
      };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) {
      return { available: false, scope: "unclear", authorityIds: [], reply: "", error: "empty" };
    }

    const parsed = JSON.parse(raw) as {
      scope: AiRead["scope"];
      authority_ids: string[];
      maybe_published: boolean;
      reply: string;
      better_question: string;
    };

    // Never trust an id we did not supply.
    const known = new Set(AUTHORITIES.map((a) => a.id));
    const authorityIds = (parsed.authority_ids ?? []).filter((id) => known.has(id));

    return {
      available: true,
      scope: parsed.scope === "central" || parsed.scope === "state" ? parsed.scope : "unclear",
      authorityIds,
      betterQuestion: parsed.better_question?.trim() || undefined,
      maybePublished: Boolean(parsed.maybe_published),
      reply: parsed.reply?.trim() ?? "",
    };
  } catch {
    return {
      available: false,
      scope: "unclear",
      authorityIds: [],
      reply: "",
      error: "network",
    };
  }
}
