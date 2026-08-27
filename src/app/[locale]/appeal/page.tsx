import { redirect } from "next/navigation";

/** Appeals hang off the request they are about, which lives in the account. */
export default async function AppealIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/account/appeals`);
}
