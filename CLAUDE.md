# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-page personal portfolio built with React 18, TypeScript, and Vite. It is not a Next.js project, despite the parent folder's name.

## Commands

```bash
npm run dev      # Vite dev server, at /Portfolio/
npm run build    # type-check with tsc, then bundle to dist/
npm run lint     # ESLint; any warning fails (--max-warnings 0)
npm run preview  # serve the production build locally
npm run deploy   # build, then publish dist/ to the gh-pages branch
```

There is no test runner. `npm run build` and `npm run lint` are the available checks. `tsconfig.json` enables `noUnusedLocals` and `noUnusedParameters`, so unused code fails the build.

## Architecture

`src/main.tsx` sets the `motion` class on `<html>` (unless the visitor prefers reduced motion) and mounts a `BrowserRouter` with a single `/` route to `src/App.tsx`. `App.tsx` starts the scroll engine and stacks the sections in order, with ids `home`, `about`, `experience`, `services`, `skills`, `projects` and `contact`. `Header` is the hero section. Navigation is `SiteNav`, a floating pill at the bottom of the screen that opens a full-screen section menu. `src/pages/LandingPage` and `src/components/ProjectsCardGrid` are placeholders that nothing renders.

Each section pins to the screen and animates as you scroll. The engine is in `src/hooks/motion/`:

- `loop.ts` runs Lenis smooth scrolling and one `requestAnimationFrame` loop.
- Sections subscribe with `useChapter`, which hands them their 0–1 scroll progress each frame.
- `math.ts` holds the easing helpers, and `layout.ts` the pure layout functions for experience rows and the project grid.

`DESIGN.md` explains the chapter pattern and how to add a section.

`src/data/links.ts` holds the CV URL, contact details, and social profiles, which the pill, hero, and contact section share. Work history lives in `src/data/experienceData.json`, which `ExperienceSection` renders, and the tools list lives in `src/data/skills.ts`, which the hero tiles and `SkillsSection` share.

### Project content is data-driven

To add or change a portfolio project, edit `src/data/projectData.json`, not the components. `src/data/projects.ts` types it. `ProjectContainerSection` renders a card for each entry, and clicking a card opens `ProjectDetail`. The hero's project count comes from the array's length.

- `imageUrl` is a bare filename in `src/assets/`, resolved with `new URL(..., import.meta.url)`. Filenames are case-sensitive on Linux, so they must match exactly. An empty value renders a placeholder showing "AI" or the category's initials.
- `category` drives the project filter buttons, which are generated from the values present in the data.
- An empty `url` hides the "Visit project" link in the detail panel. Set `"offline": true` to show "Website is no longer up" instead.

### Base path

The site is served from `https://janpatmat.github.io/Portfolio/`, so the `/Portfolio` prefix appears in three places that must stay in sync: `base` in `vite.config.ts`, `basename` in `src/main.tsx`, and `homepage` in `package.json`.

Files in `public/` are copied to the root of `dist/`, so at runtime they live under `/Portfolio/<file>` with no `public/` segment.

### Styling

`DESIGN.md` at the root describes the design system: black with warm off-white text, Instrument Serif headlines with Geist body text, and the scroll-driven motion rules. Read it before any UI work.

- Each component has a co-located `*.module.scss` file, imported as `styles`.
- `src/globals/global.scss` defines the palette and fonts as CSS custom properties on `:root`, so modules use them without importing anything.
  - `--bg`, `--text` and `--muted` are for dark areas.
  - `--paper`, `--ink` and `--ink-muted` are for the off-white surfaces.
  - `--accent` (ember orange) is used sparingly, for the hero's "AI", hovers, and the image placeholder glow.
- `global.scss` also provides the shared `.chapter`, `.stage`, `.label`, `.serif`, `.visually-hidden` and `.on-paper` classes.
- Styles that depend on motion are scoped under `:global(html.motion)` or `:global(html:not(.motion))`. Without motion, every element's default style must be its final state.
- `App.tsx` imports `global.scss` before any component. That order lets a module override a shared class at equal specificity, so keep the import first.

### Deployment

GitHub Pages serves this site from the `gh-pages` branch, so `npm run deploy` is what updates the live site. `.github/workflows/static.yml` runs on pushes to `master`, but it uploads the repository without building it and is not the source the live site is served from.
