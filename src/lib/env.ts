/**
 * Secrets, from whichever runtime we happen to be in.
 *
 * On Workers they arrive on the Cloudflare env binding; under `next dev` they
 * come from the process environment or `.dev.vars`. Nothing here throws if a
 * value is missing — the AI layer is designed to be absent.
 */
export async function secret(name: string): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const value = (ctx?.env as unknown as Record<string, string | undefined>)?.[name];
    if (value) return value;
  } catch {
    // not on Workers
  }
  return process.env[name];
}
