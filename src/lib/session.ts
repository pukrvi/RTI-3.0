/**
 * A simulated citizen sign-in.
 *
 * Everything here is mocked, deliberately and visibly. No account is created,
 * no password exists, no one-time code is generated or sent, and the code entry
 * accepts any six digits. There is nothing to steal because there is nothing to
 * store: the "session" is an email address or mobile number the citizen typed,
 * held in a cookie for a day.
 *
 * Worth recording, because it is a real design tension: the live portal has no
 * citizen account at all, and that is one of the few things it gets right — it
 * avoids building an identity record around politically sensitive requests. An
 * account buys the citizen a place to see their own filings; it costs them that
 * protection. This prototype takes the account, says so on /about, and stores
 * as little as it can get away with.
 */
import { cookies } from "next/headers";

export const SESSION_COOKIE = "rti_session";
export const PENDING_COOKIE = "rti_pending";

export interface Session {
  /** Whatever the citizen typed: an email address or a mobile number. */
  contact: string;
  method: "email" | "mobile";
}

function parse(raw: string | undefined): Session | null {
  if (!raw) return null;
  const [method, ...rest] = raw.split(":");
  const contact = rest.join(":");
  if (!contact) return null;
  return { contact, method: method === "mobile" ? "mobile" : "email" };
}

export async function currentSession(): Promise<Session | null> {
  return parse((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function pendingSession(): Promise<Session | null> {
  return parse((await cookies()).get(PENDING_COOKIE)?.value);
}

export async function setPending(session: Session): Promise<void> {
  (await cookies()).set(PENDING_COOKIE, `${session.method}:${session.contact}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
}

export async function signIn(session: Session): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${session.method}:${session.contact}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  jar.delete(PENDING_COOKIE);
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(PENDING_COOKIE);
}

/** Looks like a mobile number if it is mostly digits; otherwise treat as email. */
export function methodFor(contact: string): "email" | "mobile" {
  return /^[+\d][\d\s-]{6,}$/.test(contact.trim()) ? "mobile" : "email";
}
