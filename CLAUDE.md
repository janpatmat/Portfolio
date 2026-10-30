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

`src/main.tsx` mounts a `BrowserRouter` with a single `/` route to `src/App.tsx`, which stacks the page sections in order. `Header` is the hero section; the fixed navigation is `Navbar`, whose links target each section's `id`. `src/pages/LandingPage` and `src/components/ProjectsCardGrid` are placeholders that nothing renders.

`src/data/links.ts` holds the CV URL, contact details, and social profiles, which the hero, contact section, and footer share. Work history lives in `src/data/experienceData.json`, which `ExperienceSection` renders.

### Project content is data-driven

To add or change a portfolio project, edit `src/data/projectData.json`, not the components. `ProjectContainerSection` renders a `FeaturedProjectComponent` card for each entry, and the hero's project count comes from the array's length.

- `imageUrl` is a bare filename in `src/assets/`, resolved with `new URL(..., import.meta.url)`. Filenames are case-sensitive on Linux, so they must match exactly. An empty value renders an icon placeholder.
- `category` drives the project filter tabs, which are generated from the values present in the data.
- An empty `url` hides the "Visit Project" link. Set `"offline": true` to show "Website is no longer up" instead.

### Base path

The site is served from `https://janpatmat.github.io/Portfolio/`, so the `/Portfolio` prefix appears in three places that must stay in sync: `base` in `vite.config.ts`, `basename` in `src/main.tsx`, and `homepage` in `package.json`.

Files in `public/` are copied to the root of `dist/`, so at runtime they live under `/Portfolio/<file>` with no `public/` segment.

### Styling

- Each component has a co-located `*.module.scss` file, imported as `styles`.
- `src/globals/global.scss` defines the palette and fonts as CSS custom properties on `:root`, so modules use them without importing anything. Buttons use `--button`; yellow panels and highlights use `--accent`.
- `global.scss` also provides the shared `.container`, `.section`, `.accent`, and `.button` classes, and base element styles for headings and `p`.
- `App.tsx` imports `global.scss` before any component. That order lets a module override a shared class at equal specificity, so keep the import first.

### Deployment

GitHub Pages serves this site from the `gh-pages` branch, so `npm run deploy` is what updates the live site. `.github/workflows/static.yml` runs on pushes to `master`, but it uploads the repository without building it and is not the source the live site is served from.
