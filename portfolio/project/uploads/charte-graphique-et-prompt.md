# Portfolio Lucas Luisetti — Charte graphique & Prompt Claude design

## Identité
- **Nom :** Lucas Luisetti
- **Tagline :** Designer-turned-developer.
- **Profil :** Junior fullstack, background graphiste 3D
- **Objectif :** CDI en ESN ou boîte produit
- **Personnalité :** créatif/curieux + technique/rigoureux

## Direction esthétique
**"Natural luxury / earth-tech"** — pierre brute mate avec cœur d'ambre incandescent, petites plantes et mousses en tons ocre/rouille. Inspiration : spécimens géologiques éclairés de l'intérieur.

## Palette
| Rôle | Hex | Usage |
|---|---|---|
| Background | `#1A1A1A` (gradient vers `#141414` aux bords) | Fond principal |
| Foreground | `#F5F1EA` | Texte principal (off-white chaud) |
| Foreground muted | `#888479` | Tagline, textes secondaires |
| Amber primary | `#D88E3D` | Trait scroll, dot About |
| Amber bright | `#E8A04A` | Hover, highlights |
| Amber deep | `#8B4F1C` | Dividers, accents subtils |

## Typographie
- **Famille :** Euclid Circular A (fallback : Geist / Inter)
- **Hero name :** ~110-130px Medium, tight tracking
- **Tagline :** ~22-26px Regular
- **Body :** ~16-18px
- **Labels uppercase :** ~11-12px, letter-spacing 0.25em
- **Projets fermés :** 2 tailles à proposer (XXL ~96-120px et M+ ~64px) pour arbitrer

## Comportements transverses
- Smooth scroll classique
- Desktop-first, mobile fonctionnel
- Pas de nav bar, pas de noise, pas de curseur custom

---

## Prompt prêt à coller dans Claude design

```
# Portfolio Homepage — Lucas Luisetti

## Brief
Design and code the homepage for Lucas Luisetti's developer portfolio. Lucas is a junior fullstack developer with a 3D graphic design background, looking for a CDI position at a digital agency or product company. The site must showcase strong visual sensibility while staying technically clean.

## Visual direction
"Natural luxury / earth-tech" — dark cinematic mood inspired by raw matte stones with glowing amber cores, surrounded by small ochre plants, dried flowers, and moss in warm earth tones. Think geological specimens lit from within. (I will provide reference images — use them for color and texture mood.)

Theme: dark mode only, sober and elegant.

## Color palette
- Background: soft dark grey with subtle vertical gradient — base #1A1A1A, slightly darker #141414 at top/bottom edges
- Foreground primary: warm off-white #F5F1EA
- Foreground muted: #888479
- Accent amber (inspired by glowing stone interior):
  - Primary glow #D88E3D (scroll line, About dot)
  - Hover/highlight #E8A04A (link hover)
  - Deep amber #8B4F1C (subtle dividers)

The amber must feel like it emerges from incandescent stone — never flat, never neon. Soft glow effects (text-shadow, box-shadow blur) welcome on amber elements.

## Typography
- Font family: Euclid Circular A (fallback: Geist, Inter, or system geometric sans)
- Hero name: ~110-130px Medium, tight tracking
- Tagline: ~22-26px Regular, muted color
- Body: ~16-18px
- Uppercase labels: ~11-12px, letter-spacing 0.25em
- Closed project titles: propose TWO size variants — "XXL impact" (~96-120px, awwwards-style) and "M+ refined" (~64px). I will choose.

## Layout

### Top right corner (persistent on hero, fades on scroll)
Small "About" link (12-14px) with a 6px amber glowing dot next to it (#D88E3D, subtle glow). On hover: dot pulses brighter.

### Section 1 — Hero (full viewport height)
Left column (~40-45% width, vertically centered, ~80-100px left padding):
- Line 1: "Lucas Luisetti" — XXL, Euclid Circular A Medium
- Line 2: "Designer-turned-developer." — Medium size, Regular weight, muted color

Right column (~55-60% width):
- Floating rock visual centered vertically: dark matte stone with a glowing amber/gold core, small ochre plants and moss in warm tones, soft particles around it. Plain dark grey background blending with the page.
- The visual feels like it's floating with breathing room around it.
- V1 = static image. Wrap it in a component/div ready to swap for a <video autoplay muted loop> later.

Bottom of viewport:
- Thin horizontal amber-glowing line spanning full width (~1-2px tall, color #D88E3D with soft box-shadow 0 0 12px #D88E3D glow).
- Text "scroll down" (uppercase, tracked, 11-12px, off-white) sits centered on the line with a tiny background patch matching the page bg to cut through the line.
- The line should feel like one of the amber fissures in the rock — a subtle visual rhyme.

### Section 2 — Projects
Vertical stack, full-width container, generous side padding.

**Project 01 — Featured**
Reference component pattern: FeaturedSpotlight from 21st.dev (text left + image right, animated label line, circular CTA, corner accents on image at hover, "01" mono index in corner).

At rest:
- Left: small "Featured" label with a 32px hairline foreground line; project title in large type (~64-72px); 1-2 line description in muted color; circular CTA button (40-48px) with ArrowUpRight icon at the bottom.
- Right: project image (~380x420 desktop), no border, no shadow.

On hover:
- Hairline label line extends 32 → 48px
- Title characters shift (Y -2px on line 1, X +12px on line 2, staggered)
- Description opacity rises
- CTA button fills with foreground color, icon rotates 45°
- Image translates +4 -4px and scales 1.03
- 4 corner accents (white hairlines) appear with staggered delays
- "01" mono index drops 12px and increases opacity

On click: navigates to /projects/[slug].

**Projects 02 & 03 — Closed**
At rest: project title ONLY (no image, no metadata at rest).
On hover:
- Subtle horizontal translation (~12-16px right)
- Thin amber line (#D88E3D with soft glow) appears under the title, animates left → right
- Slight title fade-up
On click: navigates directly to /projects/[slug] (no swap with featured).

Spacing: ~120-160px between featured and closed list, ~80-100px between closed projects.

### Section 3 — Footer
"© 2026 Lucas Luisetti" only, muted color, ~12px, centered or left-aligned, comfortable vertical padding (~40-60px).

## Behavior
- Smooth scroll (CSS scroll-behavior: smooth)
- Desktop-first; mobile: hero text top + rock below, projects stack naturally
- No nav bar, no custom cursor, no grain/noise

## Stack
React + Next.js (App Router) + TypeScript + Tailwind CSS + shadcn structure.
Components in /components/ui/.
Icons via lucide-react.

## Placeholder content
- Project 01 (featured): "Amber Studio" — A modern tool for creative agencies. (Web app, 2025)
- Project 02: "Helio Dashboard"
- Project 03: "Petrichor"

## Deliverable
A single Next.js page (app/page.tsx) with all sections, plus reusable components in /components/ui/. Don't build the project detail pages — just the homepage and a placeholder route stub.
```

---

## Notes pour utiliser ce prompt

1. **Joins les images de référence** (les 8 visuels Midjourney de roches ambrées/grises) à ton prompt dans Claude design pour qu'il capte la mood visuelle.
2. **Pour la roche du hero**, utilise comme placeholder image une de tes refs avec un fond dark grey neutre. Plus tard tu remplaceras par une vidéo (le wrapper sera prêt).
3. **Si Claude design propose les deux tailles de fermés** (XXL et M+), regarde côte à côte et choisis. Sinon demande-lui les deux versions.
4. **Stack flexible** : si tu préfères Vite + React au lieu de Next.js, change cette ligne dans le prompt.
