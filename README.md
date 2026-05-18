# Portfolio — Lucas Luisetti

Portfolio personnel développé from scratch. Design sombre et typé, animations ambiantes, CMS maison pour gérer les projets et les contenus.

Déployé sur → **[lucasluisetti.me](https://lucasluisetti.me)**


## Stack

| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| Style | Tailwind v4|
| Police | Euclid Circular A |
| Icônes | Font Awesome |
| HTTP | Axios |
| Backend | API REST séparée — `api.lucasluisetti.me` |


## Architecture

app/
  page.tsx              → Home (hero + 3 projets basic)
  about/                → Page À propos
  projects/[id]/        → Détail d'un projet
  batcave/              → CMS admin (securisé)
  layout.tsx            → Layout racine (police, NavBar, preload)
  not-found.tsx         → Page erreur 404
  

components/
  HeroSection           → Section hero avec image de fond
  FeaturedProject       → Card projet principal
  ClosedProject         → Card projet secondaire
  ProjectCarousel       → Carrousel d'images projet
  CircleButton          → Bouton rond (icon-only)
  GlowSeparator         → Séparateur animé (horizontal + vertical)
  NavBar, Footer, ...


## Pages

  ### Home `/`
  Hero plein écran + liste des projets(3).

  ### À propos `/about`
  Présentation en 4 sections avec animation de fondu au scroll. Liens vers reseaux externes et bouton pour dl mon CV

  ### Projet `/projects/[id]`
  Carrousel d'images, description, stack technique, liens( Git ou autres).

  ### Admin `/batcave`
  CMS interne pour gérer les projets, les images, les informations du portfolio et les réseaux sociaux. Accès par mot de passe.


## Design system

Tout est dans `app/globals.css` et  `admin.css `. Ces fichiers partagent les classes CSS communes. Sinon chaques components a son module CSS avec les classes qui lui sont propres.



**Breakpoint**
```
mobile  : < 960px
desktop : ≥ 960px
```

**Règle CSS / Tailwind**
- Tailwind = Pour le POSITIONNEMENT: 
    exemple:layout, spacing, sizing (`flex`, `grid`, `gap`, `p-*`, `m-*`, `w-*`, `h-*`)
- CSS Modules = Pour le STYLE PRECIS 
    exemple: couleurs, animations, transitions, typographie fine, effets visuels

---------------------------------------------------------------------

## Lancer le projet

```bash
npm install
npm run dev
```

Créer un fichier `.env.local` à la racine :

```
NEXT_PUBLIC_API_URL=https://api.lucasluisetti.me
```

---

## Variables d'environnement

 `NEXT_PUBLIC_API_URL`  URL de l'API backend 

---

## Déploiement

Le site est déployé sur **Vercel**. Chaque push sur `master` déclenche un redéploiement automatique.

Le backend tourne sur un VPS avec **Caddy** (HTTPS automatique via Let's Encrypt).

---

