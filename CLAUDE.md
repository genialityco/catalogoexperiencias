# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production to ./dist/
npm run preview      # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

**Astro 5 + SSR on Netlify.** Uses `output: "server"` with the Netlify adapter (`astro.config.mjs`). All pages are server-rendered. React is used only for interactive 3D/animation components via `@astrojs/react`.

Netlify is configured to redirect `/*` → `/.netlify/functions/entry` (SSR fallback). Assets get immutable cache headers; HTML gets `must-revalidate`.

### Page structure

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage: Hero → Pitch → Experiences → FanZones → Investment → BTL → FooterCTA |
| `/experiencias` | `src/pages/experiencias.astro` | Catalog page with `Experiences.astro` component |
| `/experiencias/[slug]` | `src/pages/experiencias/[slug].astro` | Uses `getStaticPaths()` — URLs baked at build time; new experiences require rebuild |
| `/admin` | `src/pages/admin.astro` | Internal CMS — no auth guard |
| `/hablemos` | `src/pages/hablemos.astro` | Contact page |
| `/reto`, `/ecosistema`, `/planes` | `src/pages/*.astro` | Supporting marketing pages |
| `/fan-zones/*` | `src/pages/fan-zones/*.astro` | Fan zone pages |

### Firebase integration (`src/lib/firebase/`)

- `client.ts` — initializes Firebase App (singleton guard via `getApps()`); reads all config from `PUBLIC_FIREBASE_*` env vars
- `database.ts` — Firestore CRUD for `leads` and `experiences` collections; exports typed interfaces
- `storage.ts` — uploads images to `experiences/{uid}/{timestamp}-{filename}`, max 5MB; returns `downloadUrl`; if Storage throws 403, saves record without image (doesn't fail)

**`experiences` collection schema** — `ExperiencePayload`:

| Field | Type | Notes |
|---|---|---|
| uid | string | docID; auto-generated as `slugify(name)-{timestamp}` |
| name | string | Display title |
| slug | string | URL slug |
| formatCategory | string | Technology/format label |
| subtitle, description | string | Public copy |
| keyFeatures | string[] | Max 4 items |
| addons, videoUrl | string | Optional |
| tagsInteraction, tagsVibe, tagsCapture, track, origin | string | Classification tags |
| dimensions, power, setupTime, logisticsConstraints | string | Logistics |
| internet, modality, capacity, sessionLength, equipmentIncluded | string | Operational |
| image, secondImage | string | Storage download URLs |
| photosNeeded | string | |
| visible | boolean | `true` = shown in public catalog |
| createdAt, updatedAt | Timestamp | `serverTimestamp()` |

**`leads` collection** — `LeadPayload`: `name`, `email`, `phone`, `company`, `message`, `createdAt`.

### Legacy field mapping

`[slug].astro` contains a `normalizeExperience()` function that maps old field names to new ones so older Firestore documents still render correctly:

- `experiencia` → `name`
- `descripcionDetallada` → `description`
- `tecnologia` → `formatCategory`

A `DEFAULTS` object fills in missing fields.

### Component patterns

- `.astro` components own layout and markup; inline `<script>` tags handle client-side behavior (Astro processes these as module scripts)
- React `.jsx` components (`EnergyAura`, `LiquidEffect`, `PixelReveal`, `ScrollAnimations`, `SmoothScroll`) use Three.js/GSAP/Lenis for 3D effects and smooth scrolling
- Styling: Tailwind utility classes + scoped `<style>` blocks in `.astro` files

**`Experiences.astro`** fetches all Firestore experiences client-side, filters `visible === true`, then renders a paginated grid of 18 items per slide. Carousel dots are shown only when there are >18 visible items.

Fallback image when none is set: `/assets/experiences/experiencia-ejemplo1.jpg`

### Admin panel (`/admin`)

Two-tab sidebar: **Clientes** (read-only leads list) and **Experiencias** (full CRUD).

Each experience row has: toggle visibility (👁️/🚫), edit (✏️), delete (🗑️). Create/edit share the same modal form.

Form parsing details that are non-obvious:
- Tags fields are comma-separated strings in the `<input>`; stored/retrieved as strings but displayed split by commas
- `keyFeatures` is newline-separated in a `<textarea>`; truncated to 4 items on save
- On edit, `populateFormForEdit()` joins arrays back to the input format

All Firebase operations are performed from inline `<script>` tags importing from `src/lib/firebase/database.ts` and `src/lib/firebase/storage.ts`.

### Environment variables

Required in `.env`:

```
PUBLIC_FIREBASE_API_KEY
PUBLIC_FIREBASE_AUTH_DOMAIN
PUBLIC_FIREBASE_DATABASE_URL
PUBLIC_FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_STORAGE_BUCKET
PUBLIC_FIREBASE_MESSAGING_SENDER_ID
PUBLIC_FIREBASE_APP_ID
PUBLIC_FIREBASE_MEASUREMENT_ID  # optional
```

All must be prefixed `PUBLIC_` to be accessible in client-side Astro scripts.

### Design tokens (`tailwind.config.mjs`)

Brand colors: `brand-dark` (#0a0e27), `brand-cyan` (#00f0ff), `brand-purple` (#7c3aed), `brand-pink` (#ec4899), `brand-accent` (#06b6d4). Neon cyan (`#00ffff`) and magenta (`#ff00ff`) are used in inline styles for glow effects.

Custom animations: `glow`, `float`, `slide-up`, `fade-in`, `scale-in`, `pulse-slow`.

Font stack: Inter (body / `font-sans`), Space Grotesk (display), Sora (headings).

### Deployment

Deployed to Netlify. Run `firebase deploy --only storage` to push Storage security rules. `database.rules.json` and `storage.rules` version the Firebase security rules.
