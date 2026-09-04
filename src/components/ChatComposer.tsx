"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Icon from "@/components/Icon";

/**
 * The chat composer: the one box that sends a question.
 *
 * Server-rendered chat posts a plain <form> so the tool works with scripting
 * switched off; this client shell only adds the 2026 expectations on top:
 *   • Enter sends (Shift+Enter for a new line), the box grows with typing.
 *   • The send button shows a spinner while the server action is in flight.
 *   • The microphone uses the device's own speech recognition (Web Speech API
 *     where the browser has it — Chrome on Mac and Android) to dictate into
 *     the box. Where the API is absent the button simply focuses the box, so
 *     the keyboard's own microphone still works. Nothing is recorded or
 *     stored: the transcript lands in the textarea and is sent only when the
 *     citizen presses Send.
 */

function localeToBcp47(locale: string): string {
  const map: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    te: "te-IN",
    ta: "ta-IN",
    gu: "gu-IN",
    ur: "ur-IN",
    kn: "kn-IN",
    or: "or-IN",
    ml: "ml-IN",
  };
  return map[locale] ?? `${locale}-IN`;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return Ctor ?? null;
}

function ComposerSend({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn send"
      disabled={pending}
      aria-busy={pending || undefined}
    >
      {pending ? (
        <span className="send-pending" aria-hidden="true">
          <span className="spinner" />
        </span>
      ) : (
        <span className="send-ic" aria-hidden="true">
          <Icon name="send" />
        </span>
      )}
      {label}
    </button>
  );
}

export default function ChatComposer({
  action,
  locale,
  placeholder,
  sendLabel,
  voiceLabel,
  listeningLabel,
}: {
  action: (form: FormData) => void | Promise<void>;
  locale: string;
  placeholder: string;
  sendLabel: string;
  voiceLabel: string;
  listeningLabel: string;
}) {
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const baseRef = useRef<string>("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    setVoiceSupported(getSpeechRecognition() !== null);
    return () => {
      try {
        recogRef.current?.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  const toggleVoice = () => {
    const box = boxRef.current;
    const Ctor = getSpeechRecognition();
    // No Web Speech API here (Firefox, Safari): fall back to the keyboard's
    // own microphone — focusing the box is the honest thing to do.
    if (!Ctor) {
      box?.focus();
      return;
    }
    if (listening) {
      try {
        recogRef.current?.stop();
      } catch {
        /* already stopped */
      }
      setListening(false);
      return;
    }
    try {
      const recog = new Ctor();
      recogRef.current = recog;
      recog.lang = localeToBcp47(locale);
      recog.continuous = false;
      recog.interimResults = true;
      baseRef.current = box?.value ? `${box.value.replace(/\s+$/, "")} ` : "";
      recog.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0]?.transcript ?? "";
        }
        if (box) {
          box.value = `${baseRef.current}${transcript}`;
          box.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };
      recog.onend = () => {
        setListening(false);
        box?.focus();
      };
      recog.onerror = () => setListening(false);
      recog.start();
      setListening(true);
    } catch {
      setListening(false);
      box?.focus();
    }
  };

  return (
    <form action={action} data-chat-form>
      <input type="hidden" name="locale" value={locale} />
      <div className="row">
        <label className="visually-hidden" htmlFor="question">
          {placeholder}
        </label>
        <textarea
          id="question"
          ref={boxRef}
          name="question"
          rows={1}
          required
          lang={locale}
          placeholder={placeholder}
          aria-describedby={listening ? "voice-live" : undefined}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter keeps a newline — the ChatGPT habit.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="button"
          className={`icon-btn mic${listening ? " is-live" : ""}`}
          onClick={toggleVoice}
          aria-pressed={listening}
          aria-label={listening ? listeningLabel : voiceLabel}
          title={voiceSupported ? voiceLabel : `${voiceLabel} — ${listeningLabel}`}
        >
          <span aria-hidden="true">
            <Icon name="mic" />
          </span>
          {listening && <span className="mic-dot" aria-hidden="true" />}
        </button>
        <ComposerSend label={sendLabel} />
      </div>
      <span id="voice-live" className="visually-hidden" role="status">
        {listening ? listeningLabel : ""}
      </span>
    </form>
  );
}
