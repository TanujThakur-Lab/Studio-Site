# [BRAND NAME]: studio site

A single-page marketing site for a two-person studio that builds Claude-powered admin workflows. It's a static site built with Astro, with the Motion library for spring and scroll animation. It has no trackers or analytics and makes no third-party requests: the fonts are bundled. Every demo on the page is scripted with sample data, and no AI runs on the site.

## Run it locally

Node 22.12 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321. To check the production build:

```bash
npm run build
```

```bash
npm run preview
```

## Deploy to Cloudflare Pages (free)

**Option A, from Git (recommended).** Push this folder to a GitHub or GitLab repository. In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Connect to Git and pick the repository. Use these settings:
- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION` = `24`

Every push to `main` then redeploys the site.

**Option B, direct upload from your machine:**

```bash
npm run build
```

```bash
npx wrangler pages deploy dist --project-name brand-name
```

The first run asks you to log in to Cloudflare. `public/_headers` sets the security headers and long caching for the hashed assets.

**GitHub Pages instead?** Add `base: '/<repo-name>'` to `astro.config.mjs` (unless you use a custom domain), set `SITE_URL` to `https://<user>.github.io`, and deploy with the official `withastro/action` GitHub Action.

## Placeholders to replace before launch

| Where | Placeholder | What to put there |
|---|---|---|
| `src/config.ts` | `BRAND` = `[BRAND NAME]` | The studio name (nav, title, footer, Open Graph tags) |
| `src/config.ts` | `SITE_URL` = `https://studio-site-8gn.pages.dev` | Change only if you add a custom domain (used for the canonical URL, Open Graph and the sitemap) |
| `src/config.ts` | `BOOKING_URL` = `#contact`, `BOOKING_LABEL` | Your Cal.com, Calendly or Google booking link. Every "Book a call" button uses it |
| `src/config.ts` | `WHATSAPP_URL` = `https://wa.me/910000000000`, `WHATSAPP_LABEL` | Your WhatsApp number (digits only, with country code) |
| `src/config.ts` | `EMAIL` = `hello@example.com`, `EMAIL_LABEL` | Your contact email |
| `public/robots.txt` | `studio-site-8gn.pages.dev` | Change only if you add a custom domain |
| `public/og.png` | `[BRAND NAME]` in the image | Edit the name in `tools/og.html`, open it in Chrome at 1200×630 and save a screenshot over `public/og.png` |
| `src/components/ThisPage.astro` | `[Your first case study goes here]` | Your first real case study: the task, the time it took by hand, what the workflow does now, and the client's words (with permission) |
| `src/components/Tiers.astro` | `[notice period]` | The notice period for the monthly plan |
| `src/components/Faq.astro` | `[two weeks]` | Your real lead time |
| `src/components/Tiers.astro` | "Pricing on request" (×3) | Starting prices, if you decide to publish them |

### Claims to confirm (written as reasonable defaults, check they're true for you)

- **How it works** (`src/components/HowItWorks.astro`): the stage lengths "About a week", "A few weeks" and "Every week after".
- **FAQ, "Is our data safe?"**: says the workflows run on Claude through Anthropic's business API, and that you'll walk clients through how those terms handle their data. Make sure that matches your setup.
- **The data-safety table** (`src/components/Safety.astro`): the promises in the "A workflow from us" column.

## Sample data

Every company, person, ticket and figure in the demos lives in `src/data/sample.ts` and is labelled "Sample data" on the page: Sample Freight Ltd, Example IT Services, Demo Exports Pvt Ltd, Example Consulting LLP, and the rates and ticket numbers. None of it is real.

## Picture credit

`src/assets/typists-room-1959.jpg`: "Head Office typists room, New Zealand Railways, 1959" by Archives New Zealand, CC BY-SA 2.0, via Wikimedia Commons. The credit is in the page footer, and the full record is in `CREDITS.json`.

## Where things live

- `src/components/`: one file per section, in page order, from `Hero` to `Close`.
- `src/styles/global.css`: colour, type, spacing and motion tokens, plus light and dark mode.
- `src/lib/motion.ts`: the motion spec (springs, staggers, reveals, magnetic buttons, theme transition).
- `PRODUCT.md`: product context. `DESIGN.md`: the design system as built.
