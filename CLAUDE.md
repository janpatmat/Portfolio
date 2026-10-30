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

`src/main.tsx` mounts a `BrowserRouter` with a single `/` route to `src/App.tsx`, which stacks the page sections in order: `Header`, `ProjectSectionHeader`, `ProjectContainerSection`, `AboutmeSection`. `src/pages/LandingPage` and `src/components/ProjectsCardGrid` are placeholders that nothing renders.

### Project content is data-driven

To add or change a portfolio project, edit `src/data/projectData.json`, not the components. `ProjectContainerSection` maps over that array and renders a `FeaturedProjectComponent` for each entry.

- `imageUrl` is a bare filename in `src/assets/`, resolved with `new URL(..., import.meta.url)`. Filenames are case-sensitive on Linux, so they must match exactly.
- An empty `url` renders a disabled "Website is no longer up" button instead of the "Visit Project" link.

### Base path

The site is served from `https://janpatmat.github.io/Portfolio/`, so the `/Portfolio` prefix appears in three places that must stay in sync: `base` in `vite.config.ts`, `basename` in `src/main.tsx`, and `homepage` in `package.json`.

Files in `public/` are copied to the root of `dist/`, so at runtime they live under `/Portfolio/<file>` with no `public/` segment.

### Styling

- Each component has a co-located `*.module.scss` file, imported as `styles`.
- `src/globals/global.scss` and `src/app.css` are imported globally in `App.tsx`. `global.scss` sets the font and color for `h1`-`h6` and `p` at the element level, so those tags inherit styling everywhere.
- `global.scss` also defines the SCSS variables for the type scale and palette (`$head1`, `$portred`, `$bgcolor`, and so on). They are not injected automatically: a module must `@import` the file to use them.

### Deployment

GitHub Pages serves this site from the `gh-pages` branch, so `npm run deploy` is what updates the live site. `.github/workflows/static.yml` runs on pushes to `master`, but it uploads the repository without building it and is not the source the live site is served from.
