# Portfolio redesign: black theme with scroll-driven motion

Date: 2026-11-10
Status: approved by Patrick on 2026-11-10

## Intent

Patrick wants his portfolio to stop feeling like "the same boring default scrolling SPA". The reference is
[grail-app.com](https://grail-app.com/): sections that arrive as you scroll, motion on every scroll, and cards
that move in 3D. He wants that motion and grail's editorial look, built around black, with the project cards
as the centrepiece.

Success: someone scrolling the site feels each section play out as they scroll, the projects section is the
moment people remember, and the content and data stay as easy to maintain as they are today.

## Reference prototype

A working, throwaway prototype of the whole page exists at
`.superpowers/brainstorm/109-1794282493/content/site-flow.html` (gitignored, local only). Patrick reviewed it
and said "it's all good now". **It is the source of truth for look, layout and motion.** Its numbers
(easing curves, distances, timings, sizes) are a good starting point, not a contract. Open it in a browser
and read its source before building any section.

Earlier mockups in the same folder (`projects-motion.html`, `projects-background.html`) show the three
project-card options and backgrounds that were considered. Patrick picked option B (gather from 3D) on black.

## Decided by Patrick

- Use grail's look and motion, not the Linear `DESIGN.md` added earlier in the session.
- Projects section: cards drift in 3D and gather into a grid as you scroll (option B).
- The whole site is built around black. Claude picks the complementary colors. The current teal (`#032628`),
  yellow (`#e8c83e`) and sage button color are scrapped.
- No pink anywhere.
- The contact section shows his location only, with no "open to work" status.
- Every section in the prototype, as shown, including the calls listed under "Claude's calls" below.

## Goals

1. Every section pins while its scroll-driven animation plays, and the animation reverses when scrolling up.
2. Smooth, eased scrolling on desktop (Lenis).
3. The projects section implements option B with filters, hover tilt, and a detail panel.
4. Keep the content data-driven: `projectData.json`, `experienceData.json` and `links.ts` remain the sources,
   and adding a project still means editing only `projectData.json`.
5. Works on phones and for visitors who prefer reduced motion (see "Phones" and "Reduced motion").
6. `npm run build` and `npm run lint` pass with zero warnings.

## Non-goals

- Changing the written content beyond what the prototype shows (see "Copy").
- Deploying. `npm run deploy` publishes the live site; Patrick runs it, or asks for it, once he has checked
  the result locally.
- Touching the unused placeholders `src/pages/LandingPage` and `src/components/ProjectsCardGrid`.
- A CMS, routing changes, or new pages.

## Anti-goals (would be a failure even if it technically works)

- Copying grail's brand: its fonts, artwork, crests, 3D models, phone mockups, copy, or pink.
- Motion that blocks reading: text that never fully settles, or content reachable only by scrolling a precise amount.
- Scroll-jacking that breaks native scrolling, the browser back button, keyboard scrolling, or anchor links.
- Janky scrolling. Animate only `transform`, `opacity` and (sparingly) `filter`. No layout-triggering
  properties in per-frame loops, except the experience row width the prototype uses, which may be replaced
  with a transform-based equivalent.
- A site that is blank or broken without JavaScript-driven motion (reduced motion, slow devices).

## Constraints

- React 18, TypeScript, Vite, SCSS modules, as today. See `CLAUDE.md` for commands and conventions.
- Base path `/Portfolio` must stay in sync across `vite.config.ts`, `src/main.tsx` and `package.json`.
- `tsconfig.json` has `noUnusedLocals` and `noUnusedParameters`; ESLint runs with `--max-warnings 0`.
- No test runner exists. Verification is build, lint, and browser checks with `playwright-cli`.
- Patrick asked that the skills he installed be used: `frontend-design`, `taste-skill:design-taste-frontend`,
  `web-design-guidelines` (for a review pass), and `playwright-cli` (for browser verification).
- Project images in `src/assets/` are large (up to 1.6 MB PNGs). Nine of them render at once in the projects
  section.

## Visual system

### Colors (Claude's call, approved via the prototype)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#050505` | Page background |
| `--surface` | `#111111` | Raised dark elements (tiles) |
| `--line` | `rgba(242,239,233,.1)` | Hairlines and borders on dark |
| `--text` | `#f2efe9` | Main text on dark, warm off-white |
| `--muted` | `#8d8983` | Secondary text on dark |
| `--accent` | `#ff5a36` | Ember orange, used sparingly: the "AI" word in the hero, hover on links and menu items, the AI-project placeholder art |
| `--paper` | `#f2efe9` | Cards, service panels, the experience section, the detail panel |
| `--ink` | `#0a0a0a` | Text on paper |
| `--ink-muted` | `#6f6a63` | Secondary text on paper |

Skill-tool colors (the colored dots on tiles) keep the brand colors already defined in `SkillsSection.tsx`.

### Type

- Display: Instrument Serif, uppercase, line-height about 0.86, slight negative tracking. All section
  headlines, big numbers, the menu, the contact headline.
- Body and UI: Geist, weights 400, 500, 600.
- Both load from Google Fonts, replacing Syne, Inter and DM Sans in `global.scss`.

### Recurring pieces

- Chapter labels: small 12px semibold text pinned to the top corners of each section: section name on the
  left ("About Me"), chapter number on the right ("Chapter 01"). The hero shows "Patrick Matayabas" and
  "Davao City, Philippines" instead.
- Floating pill, fixed bottom centre on every section: a "JP" mark, a "Menu" button, and a "Download CV"
  link (`cvUrl`, with the `download` attribute). It replaces the current top `Navbar` and the `ScrollTopButton`.
- Menu: a full-screen black overlay revealed with a clip-path wipe, listing the seven sections in large serif
  with small chapter numbers. Choosing one smooth-scrolls to it and closes the menu. The button text toggles
  between "Menu" and "Close".

## Motion system

- Smooth scrolling: Lenis on the window. It does not smooth touch input (Lenis default), so phones keep native
  scrolling.
- Pinning: each section is a tall wrapper with a `position: sticky` full-viewport stage inside it, as in the
  prototype. A section's progress is 0 when its top reaches the viewport top and 1 when its bottom reaches the
  viewport bottom.
- A shared hook or small module computes progress for each section from one `requestAnimationFrame` loop that
  also drives Lenis. Sections off screen skip rendering. The per-frame work writes styles directly to elements
  via refs, not through React state, to avoid re-rendering 60 times a second.
- No animation library beyond Lenis is required. The prototype's easing helpers (cubic in-out, cubic out,
  bounce, sub-range `seg`) are enough. Using GSAP instead is acceptable if the builder prefers it, but it must
  not change the behaviour.
- Section heights (desktop) from the prototype: hero 230vh, about 280vh, experience 100vh + 45vh per extra job,
  services 100vh + 80vh per extra service, skills 230vh, projects 260vh, contact 220vh.

## Sections

Order and `id`s stay the same as today: `home`, `about`, `experience`, `services`, `skills`, `projects`,
`contact`. (The prototype used `hero` for the first one; the build keeps `home`.)

### Home (hero), chapter 00

- Copy: "Hi, I'm Patrick" small, then "SOFTWARE" / "ENGINEER" huge, then "for web, mobile, and *AI*" with "AI"
  in italic serif and accent color. A stats row along the bottom: years of experience "3+", professional roles
  "5", projects built (from `projectData.length`).
- On load, the headline letters rise into place one after another.
- About 16 small tool tiles (name plus colored dot) float around the headline at different depths, drifting
  gently. The tile layer tilts toward the mouse.
- As you scroll, the tiles fly toward and past the viewer, the headline grows and fades, and the stats fade
  first.

### About, chapter 01

- A one-sentence statement in large serif: "3+ years building reliable software: web and mobile apps, AI
  products, and the cloud they run on." Words go from dim to full brightness one by one as you scroll.
- Then the four existing highlights (Full-Stack Apps, AI Products, APIs and Cloud, Education) rise in, in a
  four-column row with hairlines on top. Their text is today's text. The links they have today may stay as
  subtle arrows or be dropped (builder's call).

### Experience, chapter 02 (off-white section)

- Background `--paper`, text `--ink`, with rounded top corners so it visibly slides up over the black section
  before it.
- Headline "WHERE I'VE WORKED". Jobs from `experienceData.json`, one row each: date, title and company on the
  left; a large serif index number in the middle; a summary on the right.
- Rows wait in a line that steps inwards and fades into the distance. As you scroll, each row comes forward to
  full size and opacity, and rows that have passed move up and fade under the header.
- Summary text: the prototype shortened each job to one line. The build must show **all** of each job's
  `details` (they are the real content), so the row height must fit up to four bullet points, or the row
  shows the first detail and the active row expands to show the rest. Builder's call which, as long as every
  detail is readable.

### Services, chapter 03

- Headline "WHAT I BRING". Three off-white panels, one per service, stacked: each new one slides up from below
  and covers the last, which shrinks, tilts back and dims.
- Each panel: "01 / 03", the service title in large serif, the description, and a large stat pulled from the
  description ("3+ years", "RAG", "60%" with a short caption).
- Copy is today's copy from `ServicesSection.tsx`, unchanged, including the 40% downtime figure the prototype
  left out. The service data should move into a small array (in the component or a data file) instead of
  three hand-written `<article>`s.

### Skills, chapter 04

- Headline "THE TOOLS / I WORK WITH". Five columns: Languages, Frameworks, AI, Cloud & DevOps, Data & tools.
- Every tool from today's `SkillsSection.tsx` list appears as a tile. The current `area` values map to the
  columns ("Data" and "Tool" merge into "Data & tools"; HTML and CSS may stay separate or merge).
- As you scroll, tiles drop from above in a shuffled order, land stacked at the bottom of their column, and
  bounce. No physics engine.
- Swiper is no longer used.

### Projects, chapter 05

- Headline "THINGS I'VE BUILT", starting huge in the centre.
- One card per entry in `projectData.json`: image (or placeholder), category chip, title, "View details →".
  Cards without `imageUrl` show a dark placeholder with an ember glow and serif "AI" (or the category's
  initials for non-AI categories).
- At the start, the cards float scattered in 3D space, drifting. Over the first ~70% of the section's scroll
  they gather into a centred grid (up to five columns, rows centred), while the headline shrinks and moves to
  the top.
- Once gathered:
  - Filter buttons appear under the headline. They are generated from the `category` values in the data, plus
    "All". Choosing one sends non-matching cards back into the dark (dimmed, pushed back in depth, not
    clickable) and re-grids the matching ones.
  - Cards tilt toward the mouse on hover.
  - Clicking a card opens the detail panel.
- Detail panel: a modal over a blurred backdrop. Image (with `imageAlt`, or the same placeholder as the card) on the left; category, title,
  `description`, `contributionTitle` + `contribution`, `functionTitle` + `functionDescription` on the right.
  "Visit project →" opens `url` in a new tab; it is hidden when `url` is empty; when `offline` is true it is
  replaced by "Website is no longer up" (today's behaviour). Closes with a Close button, a backdrop click,
  or Escape. Smooth scrolling pauses while it is open.
- Images keep resolving with `new URL(..., import.meta.url)` from the bare filename, as today.

### Contact, chapter 06

- "LET'S" / "TALK" in giant serif. As you scroll, its letters tumble down from above with a little rotation
  and bounce into place.
- Then location ("Davao City, Philippines"), the email as a large serif `mailto:` link, and the social links
  from `links.ts`, fading up.
- A footer line at the bottom of the stage: "© {year} Patrick Matayabas" on the left. The separate `Footer`
  component is folded into this stage.
- No availability status: Patrick decided the contact section shows his location only. The prototype's
  "Open to work" text goes, and so does its "Built with React" footer line (placeholder copy, Claude's call).

## Phones

Goals: no horizontal scroll at 360px wide, everything readable and tappable, nothing that depends on hover.
Guidance (details are the builder's call, verified in the browser at 390x844):

- Keep pinning where it still reads well (hero, about, projects, contact); shorten section heights.
- Hero: fewer tiles, smaller spread.
- Experience: rows full width with less inward stepping, or an ordinary stacked list that fades in.
- Services: panels full width; the stacking still works.
- Skills: columns wrap into two or three columns.
- Projects: gather into a two-column grid with smaller cards; filters scroll horizontally if they don't fit;
  the detail panel becomes a full-screen sheet with the image on top.
- No tilt on touch devices.

## Reduced motion

When `prefers-reduced-motion: reduce` is set:

- No Lenis, no pinning (sections take their natural height), no scroll-driven transforms, no floating or
  tilting.
- Everything renders in its final state: headline letters in place, about words at full brightness, all
  experience rows and service panels visible as ordinary stacked content, skill tiles in their columns,
  project cards in their grid with working filters and detail panel, contact letters in place.
- Short opacity fades on entering the viewport are acceptable.

## Accessibility

- Text split into letter or word spans must still read as one string to screen readers (`aria-label` on the
  parent and `aria-hidden` on the spans, or visually hidden full text).
- Project cards are buttons (or contain one) and are reachable by keyboard. A card must not be focusable or
  clickable while it is scattered; if a keyboard user tabs into the projects section, it should be in (or
  jump to) its gathered state.
- The detail panel is a proper modal: `role="dialog"`, `aria-modal`, focus moves into it, focus is trapped,
  Escape closes it, and focus returns to the card.
- The menu overlay traps focus while open and closes on Escape.
- Visible focus styles on dark and on paper. Color contrast meets WCAG AA for body text.

## Files and dependencies

- Add `lenis`. Remove dependencies that end up unused (likely `swiper`, `react-awesome-reveal`, `animate.css`,
  `@emotion/react`); check with a search before removing each.
- `global.scss`: new palette and fonts, base styles for the black theme. Keep it imported first in `App.tsx`.
- Rework the section components in place; delete `Navbar`, `ScrollTopButton`, `Footer`,
  `FeaturedProjectComponent` and `SectionHeading` if nothing uses them afterwards. New shared pieces (the
  pill, the menu, the detail panel, the motion hook) go under `src/components/` or `src/hooks/` following the
  existing folder-per-component pattern with co-located `*.module.scss`.
- Replace the root `DESIGN.md` (currently the Linear design) with one describing this design system: tokens,
  type, chapter labels, pill, motion rules. Update the Styling section of `CLAUDE.md` to match (palette names,
  `--accent` meaning, and the pointer to `DESIGN.md`).
- Add `.superpowers/` and keep `.playwright-cli/` in `.gitignore`.
- Compress or convert the project images (WebP at a sensible width is fine) so the projects section loads
  quickly. Update the filenames in `projectData.json` if they change.

## Verification

- `npm run build` and `npm run lint` pass.
- With `npm run dev` running, use `playwright-cli` to screenshot every section at several scroll positions,
  at 1440x900 and 390x844, and with `set-reduced-motion reduce`. Compare against the prototype.
- Check the console for errors, the filters, the detail panel (open, close three ways, offline and empty-url
  projects), the menu, the CV download link, and keyboard navigation through the projects.
- Run a `web-design-guidelines` review over the changed components and fix what it finds.

## Claude's calls

Shown in the prototype Patrick approved:

- The color palette and fonts above.
- The experience section is off-white to break up the black.
- The top navigation bar becomes the bottom pill plus a full-screen menu; the scroll-to-top button goes.
- The per-section motions other than projects: letter rise and flying tool tiles (hero), word-by-word
  brightening (about), receding rows (experience), stacking panels (services), dropping tiles (skills),
  tumbling letters (contact).
- The new about statement sentence.
- Lenis plus a custom progress loop instead of an animation library.

Made while writing this document, not shown in the prototype:

- Experience shows every job's full `details`, not the one-line summaries the prototype used.
- Services keep today's full copy, including the 40% downtime figure.
- Unused dependencies and components are removed after the rebuild.
- The Linear `DESIGN.md` is replaced with one describing this design, and `CLAUDE.md` is updated to match.
- Project images are compressed so the projects section loads quickly.
- The "Built with React" footer line is dropped.

## Left to the builder

- Code structure, hook and component names, and how section renderers are organised.
- Exact easing values, distances, and section heights, within the spirit of the prototype.
- Phone layouts within the guidance above.
- Whether to use GSAP.
- Image format and size.
