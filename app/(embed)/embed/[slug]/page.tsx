import prisma from "@/lib/prisma";
import EmbedChat from "@/components/EmbedChat";

export const dynamic = "force-dynamic";

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = await prisma.chatWidget.findUnique({ where: { slug } });

  if (!w || !w.isActive) {
    return (
      <main className="flex h-dvh items-center justify-center bg-slate-50 p-6 text-center">
        <div>
          <p className="text-base font-semibold text-slate-900">Chat is unavailable</p>
          <p className="mt-1 text-sm text-slate-500">Please contact the business directly.</p>
        </div>
      </main>
    );
  }

  // Only public fields cross to the client (no notify email/phone or owner notes)
  return (
    <EmbedChat
      slug={w.slug}
      businessName={w.businessName}
      assistantName={w.assistantName}
      primaryColor={w.primaryColor}
      greeting={w.greetingMessage}
    />
  );
}
