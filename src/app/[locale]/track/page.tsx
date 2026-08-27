import { redirect } from "next/navigation";

/** Tracking lives in the account now. */
export default async function TrackIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/account/track`);
}
