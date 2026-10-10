import Link from 'next/link';

export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-6 py-12 text-sm leading-relaxed text-ink-200">
      <Link href="/" className="text-brand-300">← Back</Link>
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-100">
        PLACEHOLDER — to be completed and reviewed by counsel before launch.
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>You must be 18 or older to use Conversa AI.</li>
        <li>You are responsible for every message you send, including AI-assisted ones. Review suggestions before sending.</li>
        <li>You must comply with the terms of each dating platform. Conversa AI only operates where an integration is supported, and Autopilot only where the platform has explicitly authorised automated messaging. A browser permission does not override a site&apos;s terms.</li>
        <li>No harassment, spam, deception for financial gain, impersonation, or messaging people who asked you to stop.</li>
        <li>Never upload intimate images of others, identity documents, or photos of third parties without their consent.</li>
        <li>AI output can be wrong. Conversa AI never guarantees matches or outcomes.</li>
        <li>Subscriptions renew until cancelled; cancel any time from Subscriptions.</li>
      </ol>
    </main>
  );
}
