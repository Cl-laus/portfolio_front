# Handoff: About Page (Lucas Luisetti — portfolio)

## Overview
The About page of a junior fullstack developer's portfolio. It introduces the
person, summarises their professional journey, lets visitors download a CV,
lists technical skills grouped by domain, and exposes social links. The page
has a single signature visual — an amber rock — that stays fixed at the centre
of the viewport while text content scrolls past it.

## About the Design Files
The files in this bundle are **design references created in HTML** —
prototypes showing the intended look and behavior, not production code to
copy directly. The task is to **recreate these HTML designs in the target
codebase's existing environment** (React/Next, Vue/Nuxt, SvelteKit, etc.)
using its established patterns, design tokens, and libraries. If no
environment exists yet, choose the most appropriate framework for the
project and implement the designs there.

## Fidelity
**High-fidelity.** Final colours, typography, spacing, animation timings and
interactions are all locked in. Reproduce pixel-perfectly within the target
framework's idioms.

## Screens / Views

### About — single scrollable page
- **Purpose**: tell the story behind the developer; download CV; show stack;
  expose social channels.
- **Layout**: vertically scrolling page with four alternating text blocks.
  - Three-column CSS grid per block: `1fr | 360px | 1fr`. Centre column is
    empty — it reserves space for the fixed rock backdrop. Left blocks place
    their content in column 1; right blocks place their content in column 3
    and align right.
  - Container max-width **1480px**, horizontal padding **96px** (mobile 24px).
  - Inter-block gap **220px** (mobile 100px).
  - Top padding **140px**, bottom padding **240px**.
  - The rock image is `position: fixed; inset: 0` centred via flex, sitting
    behind text (`z-index: 0`). Text blocks are `z-index: 4`. Footer is
    `z-index: 10` with a solid background so it covers the rock when scrolled
    into view.
- **Components**:
  - **Top-right "Home" link** → `portfolio.html`. `position: fixed; top: 36px;
    right: 48px`. 13 px label, `var(--fg-muted)`, transitions to
    `var(--amber-bright)` on hover. No dot, no underline. Mirrors the "About"
    link on the home page.
  - **Sticky rock backdrop**: amber rock JPG (see Assets), `width:
    min(720px, 70vw)`, `max-height: 88vh`, `object-fit: contain`.
    Drop-shadows: `0 40px 80px rgba(0,0,0,.55)` and
    `0 0 100px rgba(216,142,61,.20)`. Behind the rock, a 900×900 radial-glow
    div blurred 20px — gradient `rgba(216,142,61,.22) → .06 → transparent`.
  - **Block eyebrow**: 11 px uppercase, `letter-spacing: 0.32em`, colour
    `var(--amber-bright)`. Preceded by a 28×1 amber hairline. Format
    `01 — Hello`, `02 — Parcours`, `03 — Stack`, `04 — Liens`.
  - **Block heading (h2)**: `clamp(28px, 2.4vw, 36px)`, weight 500,
    letter-spacing -0.02em, line-height 1.15, colour `var(--fg)`,
    `margin-bottom: 20px`.
  - **Body paragraphs**: 16 px, line-height 1.7, colour `var(--fg-muted)`,
    14 px gap between consecutive paragraphs.
  - **Download CV button** (block 02): inline-flex pill, padding `14px 22px`,
    1 px hairline border, border-radius 999, 12 px uppercase label,
    letter-spacing 0.18em, 14 px download icon. On hover: background
    `var(--fg)`, colour `var(--bg)`, lift `translateY(-2px)`.
  - **Tech chips** (block 03): grouped under three labels —
    *Dev*, *3D & Design*, *Base de données*. Group label is 10 px Geist Mono,
    uppercase, letter-spacing 0.32em, colour `var(--fg-muted)`. Each chip is
    a pill: 1 px hairline border, border-radius 999, padding `8px 14px`,
    11 px Geist Mono, with a 14×14 muted glyph followed by the technology
    name. Chips wrap with 10 px gap.
  - **Social link buttons** (block 04): three 42×42 circles with 1 px
    hairline border, 16 px icons centred. GitHub, LinkedIn, Email
    (`mailto:lucas@luisetti.fr`). Hover: background and border become
    `var(--fg)`, icon flips to `var(--bg)`, micro-translate `(2px, -2px)`.
  - **Footer**: full-width strip at the bottom of the page. Padding
    `56px 96px`, 12 px muted text centred, 1 px top hairline. Solid
    `var(--bg-bot)` background so it occludes the fixed rock.

## Interactions & Behavior

### Fade in / fade out on scroll
Each `.block .col` writes two CSS custom properties driven by a single rAF
loop (see `about.html` end-of-file `<script>`):

- `--p` — 0..1 opacity progress
- `--dir` — 1 (element below viewport centre, enters from below) or -1
  (element above viewport centre, exits upward)

The block's own CSS reads them:
```css
opacity: var(--p, 0);
transform: translateY(calc((1 - var(--p, 0)) * var(--dir, 1) * 40px));
transition: opacity .25s linear, transform .25s linear;
```

Tuning constants (in JS):
- `fadeIn = vh * 0.25` — distance from viewport centre at which `--p` is 1
- `fadeOut = vh * 0.60` — distance beyond which `--p` is 0
- Linear interpolation between the two

Scroll listener is passive; updates batched via `requestAnimationFrame`. A
single `update()` call also runs on `resize` and on initial load.

### Other transitions
- Home link colour: `transition: color .35s ease`.
- CV button & link buttons: `.35s` `cubic-bezier(.2,.7,.2,1)` for transform,
  `.3s` ease for background/border/colour.
- No scroll-rotation on the rock (explicitly removed).

### Navigation flows
- Top-right "Home" → `portfolio.html`.
- Top-right "About" on the home page now links to `about.html` (the previous
  modal overlay was removed).
- Footer has no internal links.

## State Management
None. The page is fully static; the only runtime state is the per-`.col`
fade progress, derived each frame from `getBoundingClientRect()`.

## Design Tokens

### Colours
| Token | Value | Usage |
|---|---|---|
| `--bg-top` | `#322D28` | Page background gradient — top |
| `--bg-mid` | `#3D3832` | Page background gradient — middle |
| `--bg-bot` | `#45403A` | Page background gradient — bottom + footer fill |
| `--bg` | `#3D3832` | Body fallback colour |
| `--bg-edge` | `#322D28` | Edge accents |
| `--fg` | `#F5F1EA` | Primary text |
| `--fg-muted` | `#B5B0A4` | Secondary text |
| `--fg-faint` | `rgba(245,241,234,0.55)` | Tertiary text |
| `--amber` | `#D88E3D` | Brand accent (hairlines) |
| `--amber-bright` | `#E8A04A` | Brand accent (hover, eyebrows) |
| `--amber-deep` | `#8B4F1C` | Reserved (unused on this page) |
| `--hairline` | `rgba(245,241,234,0.10)` | Borders & dividers |

Page background:
`linear-gradient(to bottom, #322D28 0%, #3D3832 50%, #45403A 100%)`.

### Typography
- **Body / headings**: `"Euclid Circular A", "Geist", "Inter",
  -apple-system, system-ui, sans-serif`. Geist is loaded via Google Fonts at
  weights 300/400/500/600.
- **Mono (eyebrows, group labels, chips)**: `"Geist Mono", monospace`,
  weights 400/500.

Type scale used:
- Body: 17 px, line-height 1.6
- h2: clamp(28, 2.4vw, 36) px, weight 500, lh 1.15, ls -0.02em
- Block paragraph: 16 px, lh 1.7
- Eyebrow: 11 px, uppercase, ls 0.32em
- Group label: 10 px mono, uppercase, ls 0.32em
- Chip: 11 px mono, ls 0.06em
- CV button label: 12 px, uppercase, ls 0.18em
- Home link: 13 px, ls 0.02em
- Footer: 12 px

### Spacing
Block gap **220px**; column max-width **460px**; centre grid column **360px
fixed**; outer wrap padding **96px** (24 px mobile); inter-paragraph
margin **14px**; eyebrow→h2 margin **18px**; h2→p margin **20px**; CV button
top margin **24px**; tech-group gap **22px**; chip gap **10px**;
link-button gap **12px**.

### Radii & shadows
- Buttons / chips: `border-radius: 999px`
- Link buttons: `border-radius: 50%`
- Rock drop-shadow: `0 40px 80px rgba(0,0,0,.55), 0 0 100px rgba(216,142,61,.20)`

## Assets

| File | Notes |
|---|---|
| `assets/about-rock.jpg` | Amber rock hero. 896×1170, JPG. Background already matched to `#3D3832` (matte fill) — the file is intended to sit on the page background without further compositing. |

Replace icons (download arrow, GitHub, LinkedIn, email) with the target
codebase's icon library where available; the SVG paths in `about.html` are
inline and can be lifted directly if not.

## Responsive behaviour
At ≤960 px viewports:
- Outer padding shrinks to **24px**.
- Block grid collapses to a single column.
- Block gap reduces to 100 px.
- Rock image becomes 90vw / max-height 70vh; the radial glow is hidden.
- Home link top/right shrink to **24px**.

## Files in this bundle
- `about.html` — full HTML reference, all CSS in `<style>`, all JS in a
  single `<script>` at the bottom.
- `assets/about-rock.jpg` — rock image.

## Known cross-page touch points
- The home page (`portfolio.html`, not in this bundle) has a top-right
  "About" link styled as `.about-link` (13 px, `var(--fg-muted)`, hover
  `var(--amber-bright)`). It now links to `about.html`. The previous
  modal overlay (`#aboutOverlay`) was removed; ensure the new about page
  is reachable from the home page in the same way.
