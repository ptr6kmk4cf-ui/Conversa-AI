import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LANGUAGES } from '@conversa/shared';
import { getCurrentUser } from '@/lib/auth';

const SHOWCASE = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ar', 'ru', 'tr', 'pl', 'zh', 'ja', 'ko', 'hi', 'he', 'uk', 'vi', 'th', 'id'];

const FEATURES = [
  { t: 'Find matches', d: 'Screens profiles on supported sites against your preferences and explains every recommendation. Rejected profiles are discarded immediately.' },
  { t: 'Personal openers', d: 'Three openers built on what they actually wrote. Nothing generic, nothing invented.' },
  { t: 'Reply assistant', d: 'Context-aware replies in your voice, with per-contact memory of what matters.' },
  { t: `${LANGUAGES.length} languages`, d: 'Pick the languages you date in. Auto-detect, translate & reply, right-to-left Arabic, Hebrew, Persian and Urdu.' },
  { t: 'Private photos', d: 'Your approved photos, suggested at the right moment. Location metadata stripped.' },
  { t: 'You stay in control', d: 'One-click insert, you press send. Autopilot only where explicitly authorised, with limits and an emergency stop.' },
  { t: 'World', d: 'Meet a stranger anywhere for one hour. Random match or choose a photo. Both accept. Each writes in their own language.' },
];

export default async function Landing() {
  if (await getCurrentUser()) redirect('/app');
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="flex items-center justify-between">
        <Logo />
        <div className="flex gap-2">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/register" className="btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="py-20 text-center">
        <p className="chip mx-auto mb-6">For adults 18+ · Privacy-first · AI-assisted, human-approved</p>
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white">
          Better conversations, <span className="bg-gradient-to-r from-brand-400 to-fuchsia-400 bg-clip-text text-transparent">in any language</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-300">
          Conversa AI sits beside your dating site, finds compatible profiles, drafts personal openers and replies in your own voice — without endless copy and paste.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/register" className="btn-primary px-6 py-3 text-base">Create free account</Link>
          <Link href="/login" className="btn-secondary px-6 py-3 text-base">I have an account</Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SHOWCASE.map((code) => LANGUAGES.find((l) => l.code === code)!).map((l) => (
            <span key={l.code} className="chip" dir={l.rtl ? 'rtl' : 'ltr'}>{l.nativeName}</span>
          ))}
          <span className="chip">+{LANGUAGES.length - SHOWCASE.length} more languages</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.t} className="card">
            <h3 className="font-semibold text-white">{f.t}</h3>
            <p className="mt-2 text-sm text-ink-300">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-white/5 pt-6 text-xs text-ink-400">
        <span>© {new Date().getFullYear()} Conversa AI</span>
        <div className="flex gap-4">
          <Link href="/legal/privacy">Privacy policy</Link>
          <Link href="/legal/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold text-white">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-600">C</span>
      Conversa AI
    </span>
  );
}
