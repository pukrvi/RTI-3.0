import { redirect } from "next/navigation";

/**
 * Retired. "Search records" in the nav now lands directly in the chat at
 * /[locale]/chat, and what this page used to say arrives as a first-visit
 * pop-up over that chat. This redirect keeps old links and bookmarks working.
 */
export default async function AskRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/chat`);
}
