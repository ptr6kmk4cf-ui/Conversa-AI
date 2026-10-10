# Conversa AI Dating

Multilingual AI dating assistant: a Chrome extension panel that sits next to supported dating sites, plus a web dashboard for settings, contacts, memory, photos, billing and privacy.

> **Status:** working MVP, tested end-to-end against a **local fictional demo dating site** only. No real dating platform is integrated (see [Platform integrations](#platform-integrations)). AI has been exercised with the offline mock provider; real-provider output quality is untested until you add an API key.

## Repository layout

```
apps/web          Next.js 15 dashboard + REST API (Prisma/PostgreSQL, all AI calls server-side)
apps/extension    Chrome MV3 extension (React panel in Shadow DOM, esbuild)
apps/demo-site    "Amora" — local fictional dating site (zero deps) used for testing
packages/shared   Types, language/style lists and the platform registry shared by all apps
scripts/          dev database, API smoke test, extension E2E test, UI screenshot check
```

## Setup

Requirements: Node ≥ 20, macOS/Linux. No Docker needed (an embedded PostgreSQL is included).

```bash
npm install
cp apps/web/.env.example apps/web/.env
# set ENCRYPTION_KEY:  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# set AI_PROVIDER + AI_API_KEY (or AI_PROVIDER=mock for offline plumbing tests)

npm run db:start      # embedded PostgreSQL on :5433 (keep running; data in .data/pg)
npm run db:push       # create tables
npm run db:seed       # demo@conversa.local (+ ADMIN_EMAIL admin); prints generated passwords
npm run dev:web       # dashboard + API → http://localhost:3000
npm run dev:demo      # demo dating site → http://localhost:4000
npm run build:ext     # extension → apps/extension/dist
```

Load the extension: `chrome://extensions` → Developer mode → **Load unpacked** → `apps/extension/dist`. Then open **Dashboard → Browser Extension → Connect** (one click; the token is handed over via a page bridge and never shown). Open http://localhost:4000 and click the pink **C** button.

For a hosted API, build with `CONVERSA_API_URL=https://your-app.example npm run build:ext`.

### Environment (`apps/web/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection |
| `ENCRYPTION_KEY` | yes | 32-byte base64 key for AES-256-GCM encryption of messages, memory, notes, "about me" |
| `APP_URL` | yes | Public origin (CSRF origin check, Stripe redirects) |
| `AI_PROVIDER` | yes | `openai` \| `anthropic` \| `openai-compatible` \| `mock` |
| `AI_API_KEY`, `AI_MODEL` | for real AI | Provider credentials (server only — never in the extension) |
| `AI_VISION_MODEL` | optional | Model used for photo understanding (Premium) |
| `AI_BASE_URL` | openai-compatible | e.g. OpenRouter, Mistral, local Ollama |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID` | optional | Billing stays disabled until all are set |
| `ADMIN_EMAIL` | optional | Account registering/seeded with this email becomes ADMIN |
| `PHOTO_STORAGE_DIR` | optional | Private photo directory (default `apps/web/storage/photos`, outside the web root) |
| `DEV_TOOLS` | dev only | `true` enables `/api/dev/plan` to switch your plan for testing; ignored in production |
| `SEED_DEMO_PASSWORD`, `SEED_ADMIN_PASSWORD` | optional | Stable passwords for `db:seed` |

## Features

- **Find Matches** — extension reads profiles on the current page, hard filters (age ≥ 18, age range, distance, negation-aware dealbreakers) run before AI scoring; recommendations come with reasons/cautions. **Only recommended profiles are stored**; rejected ones are discarded in the request and only a count is returned. Photo analysis (Premium) describes visible activities/settings only — never attractiveness, ethnicity, personality or compatibility from faces.
- **Chat with someone** — add contacts manually or track an existing thread from the extension.
- **Openers** — 3 personalised openers that may only use facts from the profile and your "about me"; duplicate first-contact warning; one-click **Insert** into the site's message box (you press Send).
- **Conversation engine** — reply suggestions with continuity and per-contact memory, interest/intent signals, meeting-timing hint, multilingual stop/rejection detection (contact is marked do-not-contact), and escalation to you for money requests, sensitive data, threats, or prompt-injection attempts.
- **Languages** — 89 languages (list in `packages/shared/src/languages.ts`; right-to-left for Arabic, Hebrew, Persian, Urdu, Pashto, Yiddish; 20 low-resource languages marked beta). Users pick up to 20 "My languages" in Language settings; those appear first in every language menu. Modes: Selected / Auto-detect / Translate & Reply, globally and per contact. The model's detected-language codes are normalized (`zh-TW` → `zh`, `fil` → `tl`, `iw` → `he`); the offline fallback detector recognises 30 scripts and common words for 20 Latin-script languages.
- **Personality** — 8 styles (Natural, Funny, Charming, Romantic, Confident, Casual, Intellectual, Playful) plus humour/flirting/formality/length/emoji controls and boundaries.
- **Private photo library** — albums, captions, tags, categories, per-photo AI approval. Uploads are decoded, re-encoded and stripped of EXIF/GPS/XMP/IPTC. `PRIVATE` photos can never be AI-approved. The AI may *suggest* an approved photo; attaching requires a click and sending requires you to press Send.
- **Memory** — per contact: review, edit, add, delete, export (JSON).
- **Modes** — A: Adviser (suggestions), B: One-click insert, C: Autopilot (**local demo site only**, Premium): server-side decisions with daily limits, cooldown, duplicate prevention, consent checks, mandatory AI disclosure on the first automated message, human takeover, never sends photos, and an **Emergency Stop** in the panel and dashboard.
- **World** — opt-in section to meet a stranger for one hour. Random queue or browse opted-in profile cards (self-stated city/country, chosen portrait, never private photos). Both people must accept before any message is sent. **Chat is WebRTC peer-to-peer**: the two browsers send the words directly; Conversa only exchanges SDP/ICE to set the call up, and translates a line when you hit send (AI key stays on the server). The chat is not stored. Each writes in their own language; the other sees a live translation (original one tap away). Sensitive asks are delivered but flagged. Block and report (admins see the reason, not the chat). Public STUN is used; optional `WORLD_TURN_*` for strict NATs. Free: 2 conversations/day, you write, we translate. **Premium (€14.99/month):** AI can draft a reply (you still send), or run the whole hour after you confirm — the other person is told, money/stop/unclear turns come back to you, nothing is sent by the server (still P2P). Seeded travelers (`noor@`, `yuki@`, `piotr@`, `amara@`, `lucia@conversa.local`) share `SEED_WORLD_PASSWORD` or the demo password.
- **Commercial** — accounts with 18+ gate, Free/Premium plans and quotas, Stripe Checkout/Portal/webhook, AI usage monitoring, data export, account deletion, sessions/device revocation, support tickets, admin dashboard, privacy/terms pages (placeholders).

## Architecture & security

- **AI keys stay on the server.** The extension holds only a revocable Conversa token (background service worker; content scripts never see it) and calls `/api/*`. Provider abstraction in `apps/web/src/lib/ai/provider.ts`.
- **Untrusted text** (profiles, incoming messages) is wrapped in `<untrusted_*>` tags with explicit instructions to ignore embedded commands; outputs are schema-validated (zod) and post-filtered (contact details/links are dropped unless they come from your own "about me").
- **Minimal permissions:** manifest requests only `storage` plus host access to the API and registered platform origins. Content scripts are injected only on those origins; nothing is read from other sites.
- **Encryption at rest** for private free text (AES-256-GCM); passwords bcrypt; DB-backed sessions (httpOnly cookie for web, bearer for extension); CSRF origin checks; rate limiting; strict security headers.
- **Platform capabilities are enforced server-side** (`packages/shared/src/platforms.ts` + `assertCapability`): a platform must be registered before anything — discovery, thread reading, insertion, autopilot — works there.

### Platform integrations

Only `conversa-demo` (the local demo site) is registered. Adding a real site requires: confirming the site's terms permit this kind of assistance (and, for Autopilot, explicit authorisation), writing an adapter in `apps/extension/src/adapters/`, and adding the origin with its permitted capabilities to the registry. A browser extension's permissions do not override a site's terms; this project does not include scraping, CAPTCHA bypass or any circumvention.

The demo site implements this markup contract, read by `apps/extension/src/adapters/demo.ts`:

| Element | Attributes |
|---|---|
| `body` | `data-page="discover|profile|messages"` |
| results list / profile card | `data-conversa-results` / `data-conversa-profile data-profile-id` (profile page also `data-page="profile"`) |
| profile fields | `data-field="name|age|city|distance|bio|interest|lookingFor|lifestyle|height|language|photo"` |
| composer | `data-conversa-composer` containing `data-conversa-input`, `data-conversa-photo-input`, `data-conversa-send`; `data-conversa-open-composer="<profileId>"` opens it |
| thread | `data-conversa-thread data-thread-id data-contact-name data-profile-id` |
| message | `data-conversa-message data-message-id data-direction="in|out" data-sent-at data-has-photo`, text in `[data-text]` |
| thread list | `data-conversa-thread-link data-thread-id data-unread="0|1"` |

Demo personas exercise the safeguards: Lena (declines → consent handling), Alex (asks for money → escalation), Emma (prompt injection in bio and chat), Sofía/Inês (ask for holiday photos → photo suggestion).

## Download & install (computer and phone)

The dashboard page **Download apps** (`/app/download`) detects the device and shows the right steps.

| Device | What gets installed | How |
|---|---|---|
| Computer (Chrome, Edge) | Chrome extension — panel next to supported dating sites | `npm run package:ext` → `release/conversa-ai-extension-v<version>.zip` (Chrome Web Store-ready) and a copy served at `/downloads/conversa-ai-extension.zip`. Users unzip → `chrome://extensions` → Developer mode → Load unpacked → Connect. |
| Computer | Dashboard as a desktop app | Install button on the Download page, or the ⊕ icon in Chrome's address bar / Safari **File → Add to Dock**. |
| iPhone / iPad | Dashboard as a home-screen app | Safari → Share → **Add to Home Screen**. Copy a chat from the dating app and paste it into the AI Reply Assistant. |
| Android | Dashboard as an app + **share target** | Chrome → **Install app**. In a dating app: select text → Share → **Conversa AI** opens the reply assistant prefilled. The service worker moves shared text into the URL fragment so it never reaches the server or its logs. |

- Build the extension for a hosted backend with `CONVERSA_API_URL=https://your-app.example npm run package:ext` (non-local backends must be https). The script refuses to package if the manifest gains permissions beyond `storage` or broad host access.
- Phones only install web apps from **https://** origins, so phone install needs the backend deployed with HTTPS; `localhost` works for desktop testing only.
- Mobile browsers don't run extensions, so the on-page panel (match marking, one-click insert, Autopilot) is computer-only. A native iOS/Android app is not part of this release.
- The service worker only provides an offline page; it never caches pages, API responses or photos.
- Publishing to the Chrome Web Store needs a developer account ($5 one-time), the zip, screenshots, a privacy policy URL and a review — not done yet.

## Testing

With DB, web app (`DEV_TOOLS=true`) and demo site running:

```bash
npm run typecheck
npm run test:unit        # AI safety/filter unit tests
npm run test:api         # ~87 API checks: auth, CSRF, AI pipeline, consent, matching privacy, EXIF stripping, isolation, autopilot, export/deletion
npm run chrome:install   # once: Chrome for Testing → .cache/puppeteer
npm run build:ext && npm run test:e2e   # real extension in Chrome: connect, match marking, opener/reply insertion,
                                        # photo attach, autopilot with disclosure, emergency stop (HEADFUL=1 to watch)
npm run test:ui          # visits every dashboard page as the seeded demo user; screenshots in .cache/screens
npm run test:lang        # saves a language choice, then real-AI replies in ru/ja/ko/fa/sw/tl/pl + forced Vietnamese (~$0.01)
npm run test:world       # World: browse, mutual accept, live translation, flag, random queue
npm run package:ext && npm run test:pwa   # installability, manifest/icons, zip download, Android share flow,
                                          # iPhone/Pixel layouts (screenshots in .cache/screens/mobile)
```

Last verified run (mock AI): typecheck clean, unit 7/7, API 87/87, extension E2E 35/35, all 18 pages render, production `next build` succeeds.

## Not done yet / known limitations

- **Real AI untested** — only the mock provider has been run. Add `AI_API_KEY` and rerun `test:api` / `test:e2e` to validate output quality and language handling.
- **Stripe untested** without keys (code path: Checkout, Portal, signed webhook).
- **No real dating platforms** integrated (by design until authorised).
- Dashboard UI text is English-only (AI output supports all 89 languages; 20 low-resource languages are marked beta because model quality is weaker).
- Photo storage is local disk (driver interface ready for S3-compatible storage); rate limiter is in-memory (use Redis for multiple instances).
- Privacy policy and terms are placeholders that need legal review.
- No Safari/Firefox extension or mobile app; no email verification or password reset yet.
