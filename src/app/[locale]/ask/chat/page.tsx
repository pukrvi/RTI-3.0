import { redirect } from "next/navigation";

/**
 * Retired. RTI Mitra moved from /[locale]/ask/chat to /[locale]/chat.
 * This redirect keeps old links and bookmarks working.
 */
export default async function AskChatRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/chat`);
}
