import { getT } from "@/i18n";

type NodeKind = "process" | "pill" | "gate" | "good" | "bad" | "note";

const NODE_STYLE: Record<NodeKind, { fill: string; stroke: string; ink: string }> = {
  // Solid blue: something that happens to the request.
  process: { fill: "var(--brand)", stroke: "var(--brand)", ink: "var(--ink-invert)" },
  // Dark pill: a statutory day count.
  pill: { fill: "var(--brand-dark)", stroke: "var(--brand-dark)", ink: "var(--ink-invert)" },
  // Outlined navy: a remedy the citizen invokes.
  gate: { fill: "var(--surface)", stroke: "var(--brand-dark)", ink: "var(--brand-dark)" },
  // Green: a settled end. Red: not settled — the arrow onward is the point.
  good: { fill: "var(--ok-bg)", stroke: "var(--ok-line)", ink: "var(--ok-ink)" },
  bad: { fill: "var(--stop-bg)", stroke: "var(--stop-line)", ink: "var(--stop-ink)" },
  // Dashed note pinned to a wire, never a step.
  note: { fill: "var(--surface)", stroke: "var(--line-strong)", ink: "var(--ink-muted)" },
};

/**
 * One box on the chart. `cx`/`y` anchor the top-centre; `lines` is one or two
 * centred lines. Sizes are SVG units, not type tokens, so the type-scale
 * check does not apply — the words-alternative below it carries the same
 * journey in real text at the normal sizes.
 */
function Node({
  cx,
  y,
  w,
  h,
  kind,
  lines,
}: {
  cx: number;
  y: number;
  w: number;
  h: number;
  kind: NodeKind;
  lines: string[];
}) {
  const s = NODE_STYLE[kind];
  const outlined = kind === "good" || kind === "bad" || kind === "gate" || kind === "note";
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={y}
        width={w}
        height={h}
        rx={kind === "pill" ? 15 : kind === "note" ? 6 : 8}
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={outlined ? 1.5 : 0}
        strokeDasharray={kind === "note" ? "5 4" : undefined}
      />
      <text
        x={cx}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={kind === "pill" || kind === "note" ? 12 : 13}
        fontWeight={kind === "note" ? 400 : 600}
        fill={s.ink}
      >
        {lines.map((line, i) => (
          <tspan key={line} x={cx} dy={i === 0 ? (lines.length > 1 ? "-0.62em" : "0") : "1.24em"}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** A directed connector, arrowhead included. */
function Edge({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--line-strong)"
      strokeWidth={2}
      markerEnd="url(#flow-ah)"
    />
  );
}

/** A plain distribution wire with no arrowhead. */
function Wire({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth={2} />;
}

/**
 * The full RTI journey as a flowchart, after the board's reference diagram:
 * request, the three 30/5/30-day openings (reply, transfer, silence), first
 * appeal and the no-time-limit Section 18 complaint, the 45-day decision,
 * and the 90-day second appeal. Same stages, same counts, redrawn in this
 * site's tokens — blue for what happens, outlined navy for the remedies the
 * citizen invokes, green for settled ends, red for not-settled routes, dark
 * pills for the statutory day counts.
 *
 * Shared by the account process page and the help page, so the two can never
 * drift apart. The journey in words comes first; the chart repeats it
 * visually below for readers who want the overview, scrolling sideways on a
 * phone inside a labelled region (after the `.tablewrap` pattern). The list
 * is also the screen-reader equivalent, and each line carries its section of
 * the Act in brackets, so no separate key is needed.
 */
export default function ProcessJourney({ locale }: { locale: string }) {
  const t = getT(locale);
  const days = (n: number) => t("proc.days", { n });

  const words = [t("proc.w1"), t("proc.w2"), t("proc.w3"), t("proc.w4"), t("proc.w5"), t("proc.w6")];
  const legend: Array<{ sw: string; label: string }> = [
    { sw: "flow-sw-process", label: t("proc.legend.process") },
    { sw: "flow-sw-remedy", label: t("proc.legend.remedy") },
    { sw: "flow-sw-done", label: t("proc.legend.done") },
    { sw: "flow-sw-notdone", label: t("proc.legend.notdone") },
  ];

  return (
    <>
      <section className="section" aria-labelledby="proc-words">
        <h2 id="proc-words">{t("proc.words")}</h2>
        <ol className="step-list card">
          {words.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ol>
      </section>

      <div className="flow-scroll" tabIndex={0} role="region" aria-label={t("proc.scroll")}>
        <svg viewBox="0 0 960 880" role="img" aria-labelledby="flow-t flow-d">
          <title id="flow-t">{t("proc.h1")}</title>
          <desc id="flow-d">{t("proc.lead")}</desc>
          <defs>
            <marker
              id="flow-ah"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--line-strong)" }} />
            </marker>
          </defs>

          {/* request fans out to the three openings */}
          <Node cx={480} y={16} w={210} h={48} kind="process" lines={[t("proc.request")]} />
          <Wire d="M480 64V92M130 92H850M130 92V110M480 92V110M850 92V110" />
          <Node cx={130} y={110} w={92} h={30} kind="pill" lines={[days(30)]} />
          <Node cx={480} y={110} w={92} h={30} kind="pill" lines={[days(5)]} />
          <Node cx={850} y={110} w={92} h={30} kind="pill" lines={[days(30)]} />
          <Edge d="M130 140V160" />
          <Edge d="M480 140V160" />
          <Edge d="M850 140V160" />
          <Node cx={130} y={160} w={170} h={46} kind="process" lines={[t("proc.reply")]} />
          <Node cx={480} y={160} w={200} h={46} kind="process" lines={[t("proc.transfer")]} />
          <Node cx={850} y={160} w={180} h={46} kind="process" lines={[t("proc.noreply")]} />

          {/* a reply on the left settles the matter */}
          <Edge d="M130 206V398" />
          <Node cx={130} y={398} w={170} h={44} kind="good" lines={[t("proc.satisfied")]} />

          {/* a transfer gets its own two 30-day clocks */}
          <Wire d="M480 206V226M390 226H630M390 226V240M630 226V240" />
          <Node cx={390} y={240} w={92} h={30} kind="pill" lines={[days(30)]} />
          <Node cx={630} y={240} w={92} h={30} kind="pill" lines={[days(30)]} />
          <Edge d="M390 270V290" />
          <Edge d="M630 270V290" />
          <Node cx={390} y={290} w={170} h={46} kind="process" lines={[t("proc.reply")]} />
          <Node cx={630} y={290} w={170} h={46} kind="process" lines={[t("proc.noreply")]} />

          {/* an unsatisfying reply: 30 days to the first appeal */}
          <Edge d="M390 336V360" />
          <Node cx={390} y={360} w={170} h={44} kind="bad" lines={[t("proc.notsatisfied")]} />
          <Edge d="M390 404V420" />
          <Node cx={390} y={420} w={92} h={30} kind="pill" lines={[days(30)]} />
          <Edge d="M390 450V466" />

          {/* silence after a transfer: 30 days to the first appeal too */}
          <Edge d="M630 336V466" />
          <Node cx={630} y={400} w={92} h={30} kind="pill" lines={[days(30)]} />

          {/* either silence also feeds the Section 18 complaint */}
          <Wire d="M630 452H850" />
          <circle cx={630} cy={452} r={3} style={{ fill: "var(--line-strong)" }} />
          <circle cx={850} cy={452} r={3} style={{ fill: "var(--line-strong)" }} />
          <Node cx={740} y={440} w={64} h={24} kind="note" lines={[t("proc.and")]} />
          <Edge d="M850 206V544" />
          <Node cx={850} y={496} w={180} h={34} kind="note" lines={[t("proc.notimelimit")]} />
          <Node
            cx={850}
            y={544}
            w={190}
            h={72}
            kind="gate"
            lines={[t("proc.s181"), t("proc.s182")]}
          />

          <Node cx={510} y={466} w={250} h={50} kind="gate" lines={[t("proc.firstappeal")]} />

          {/* the appellate authority gets 45 days */}
          <Wire d="M510 516V536M390 536H630M390 536V550M630 536V550" />
          <Node cx={390} y={550} w={92} h={30} kind="pill" lines={[days(45)]} />
          <Node cx={630} y={550} w={92} h={30} kind="pill" lines={[days(45)]} />
          <Edge d="M390 580V600" />
          <Edge d="M630 580V600" />
          <Node cx={390} y={600} w={170} h={46} kind="process" lines={[t("proc.decision")]} />
          <Node cx={630} y={600} w={170} h={46} kind="process" lines={[t("proc.nodecision")]} />

          {/* a decision for the citizen settles it; anything else goes up */}
          <Wire d="M390 646V676M130 676H390M130 676V700M390 676V700" />
          <Node cx={130} y={700} w={170} h={44} kind="good" lines={[t("proc.satisfied")]} />
          <Node cx={390} y={700} w={170} h={44} kind="bad" lines={[t("proc.notsatisfied")]} />
          <Edge d="M390 744V758" />
          <Node cx={390} y={758} w={92} h={30} kind="pill" lines={[days(90)]} />
          <Edge d="M390 788V825H510" />
          <Edge d="M630 646V712" />
          <Node cx={630} y={712} w={92} h={30} kind="pill" lines={[days(90)]} />
          <Edge d="M630 742V800" />
          <Node
            cx={640}
            y={800}
            w={260}
            h={50}
            kind="gate"
            lines={[t("proc.secondappeal1"), t("proc.secondappeal2")]}
          />
        </svg>
      </div>

      <ul className="flow-legend">
        {legend.map((item) => (
          <li key={item.label}>
            <span className={`flow-sw ${item.sw}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </>
  );
}
