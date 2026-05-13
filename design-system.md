# Design System — Lucas Luisetti Portfolio

## Stack
- Next.js (App Router) + TypeScript
- Tailwind v4 (`@import "tailwindcss"`) + CSS Modules
- Police : Euclid Circular A (local), fallback system-ui
- Base font-size : 17px

---

## Règle architecture CSS
- **Tailwind** = layout, spacing, sizing, positioning (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `items-*`, `sticky`, `relative`, `absolute`…)
- **CSS module** = couleurs, animations, transitions, shadows, blur, typographie fine, effets hover, pseudo-elements
- Zéro `style={{}}`, zéro valeurs arbitraires `w-[37px]`

---

## Couleurs

```
--fg:       #2c2722   /* texte principal — brun foncé */
--fg-muted: #d3ccc5   /* texte secondaire — beige clair */
--amber:    #ffbd5b   /* accent — or chaud */
--separator: rgba(26,25,24,0.12)

/* Dégradé de fond (body, background-attachment: fixed) */
--bg-top: #9d9ea1   /* gris bleuté */
--bg-mid: #8b8989   /* gris neutre */
--bg-bot: #363638   /* gris foncé */
```

Sélection texte : `background: amber, color: #111`

---

## Typographie

```
Font : Euclid Circular A
Base : 17px / line-height 1.55 / letter-spacing 0.02em

.label  → 0.65em, uppercase, fg-muted
.title  → font-weight 500, fg
.text   → fg-muted

.proj-title → 3.5rem, weight 500, uppercase, tracking -0.035em, leading 0.95
.proj-index → 0.7em, fg-muted, tracking ls-meta
.proj-meta  → tracking ls-meta, opacity animée au hover
```

---

## Espacements (letter-spacing)

```
--ls-wide: 0.32em   /* labels, eyebrows, uppercase UI */
--ls-meta: 0.18em   /* meta info, index */
```

---

## Motion

```
--ease-snappy: cubic-bezier(.2,.7,.2,1)
--dur-snap:    550ms
--dur-fade:    400ms
```

---

## Breakpoints

```
mobile  : < 960px
desktop : ≥ 960px
```

---

## Composants clés

### GlowSeparator
Bande de séparation avec faisceau animé amber.
- Horizontal : `<GlowSeparator />`  → `h-1 w-full`
- Vertical : `<GlowSeparator vertical />` → `w-1 h-screen`
- Animation : sweep 120s linear infini

### CircleButton
Bouton rond, `size="lg"` disponible.
- Base : `w-10 h-10`, border fg-muted, color fg-muted
- Hover : background fg-muted, color bg-mid
- Lg : `w-24 h-24`

### TechChip
Pill amber avec glow.
- `border-radius: 999px`
- `color: amber`, `bg: amber 7%`, `box-shadow` + `text-shadow` amber

### NavBar
- Desktop : `position: fixed` top-right
- Mobile : `position: absolute` (scroll avec la page) + glass backdrop

### Footer
- `h-12`, amber tint background, border-top amber, texte amber

---

## Palette d'effets

```css
/* Glass card (mobile about page) */
background: color-mix(in srgb, var(--bg-mid) 40%, transparent);
backdrop-filter: blur(16px);
border: 1px solid color-mix(in srgb, var(--fg-muted) 15%, transparent);
border-radius: 1rem;

/* Glow amber générique */
box-shadow: 0 0 0.5em color-mix(in srgb, var(--amber) 85%, transparent),
            0 0 1em   color-mix(in srgb, var(--amber) 45%, transparent);

/* Séparateur */
background: color-mix(in srgb, var(--amber) 18%, transparent);
border: 1px solid color-mix(in srgb, var(--amber) 55%, transparent);
```

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero + GlowSeparator + Réalisations (FeaturedProject + ClosedProjects) |
| About | `/about` | Scroll-driven fade, image roche sticky, 4 sections texte |
| Project | `/projects/[id]` | Carousel + description + stack + liens |
| 404 | — | Page introuvable |
| Admin | `/batcave` | CMS interne |
