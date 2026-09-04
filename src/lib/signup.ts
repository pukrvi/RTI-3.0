/**
 * Pending sign-up state, held in a short-lived cookie.
 *
 * Two ways in, mirroring the login card:
 *   • email:  details (name + email + captcha) → OTP code → one-time
 *             Aadhaar citizenship check → profile details → account.
 *   • aadhaar: Aadhaar number + consent → profile details prefilled from
 *             the (simulated) fetched identity → account. The citizenship
 *             check is already satisfied by the Aadhaar handoff itself.
 *
 * Everything is simulated, like the login flow: any well-formed input
 * advances, nothing is sent anywhere.
 */
import { cookies } from "next/headers";

export const SIGNUP_COOKIE = "rti_signup";

export type SignupMethod = "email" | "aadhaar";
export type SignupStep = "code" | "verify" | "aadhaar" | "details";

export interface SignupState {
  method: SignupMethod;
  step: SignupStep;
  name?: string;
  email?: string;
  /** Last 4 of the demo Aadhaar number used, once verified. */
  aadhaarLast4?: string;
  aadhaarVerified?: boolean;
}

export async function getSignup(): Promise<SignupState | null> {
  const raw = (await cookies()).get(SIGNUP_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SignupState;
    if (parsed.method !== "email" && parsed.method !== "aadhaar") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSignup(state: SignupState): Promise<void> {
  (await cookies()).set(SIGNUP_COOKIE, JSON.stringify(state), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
}

export async function clearSignup(): Promise<void> {
  (await cookies()).delete(SIGNUP_COOKIE);
}

/**
 * The (simulated) identity a successful Aadhaar handoff returns. Fixed demo
 * values, shown prefilled and editable on the details step — never a real
 * number, never transmitted.
 */
export const DEMO_AADHAAR_IDENTITY = {
  name: "Aarav Sharma",
  addr1: "C-42, Shastri Nagar",
  addr2: "Near District Court",
  pin: "110052",
  state: "Delhi",
  gender: "male",
} as const;
