# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a black, editorial, scroll-driven site where every section pins and plays its animation as you scroll, with the project cards gathering from 3D into a grid.

**Architecture:** One `requestAnimationFrame` loop drives Lenis smooth scrolling and every section. Each section is a tall `.chapter` wrapper with a sticky 100vh `.stage`. The loop computes each chapter's 0–1 progress and calls that section's render function, which writes transforms directly to elements through refs (never React state). Pure math and layout functions live apart from the components that use them.

**Tech Stack:** React 18, TypeScript, Vite 5, SCSS modules, Lenis 1.3.x. No other animation library.

**Spec:** `docs/superpowers/specs/2026-11-10-portfolio-redesign-design.md`. Reference prototype: `.superpowers/brainstorm/109-1794282493/content/site-flow.html`. Read both before Task 1. The prototype is the source of truth for look, layout and motion, and this plan cites its line numbers instead of repeating its code.

## Global Constraints

- **Git:** do not branch, commit or push. Work on `master` and leave every change uncommitted. Patrick does all git work in GitHub himself.
- **Deploying:** never run `npm run deploy`, because it publishes the live site.
- **Section ids and order:** `home`, `about`, `experience`, `services`, `skills`, `projects`, `contact`.
- **Colors** (exact values): `--bg #050505`, `--surface #111111`, `--line rgba(242,239,233,.1)`, `--text #f2efe9`, `--muted #8d8983`, `--accent #ff5a36`, `--paper #f2efe9`, `--ink #0a0a0a`, `--ink-muted #6f6a63`.
  - No pink anywhere.
  - Use `--accent` only for the hero's "AI", link and menu hovers, and the AI-project placeholder glow.
- **Fonts:**
  - Display is Instrument Serif (regular and italic): uppercase, line-height .86, letter-spacing -.01em.
  - Body is Geist 400, 500 and 600.
  - Both load from Google Fonts and replace Syne, Inter and DM Sans.
- **Per-frame work:**
  - The loop animates only `transform`, `opacity`, `filter` and `visibility`. Nothing in it changes layout, including the experience rows (see Task 5).
  - The loop never sets React state.
- **Content comes from data:** `projectData.json`, `experienceData.json` and `links.ts`. Adding a project must still mean editing only `projectData.json`.
  - Copy stays as today's, apart from what the spec and this plan change.
- **Motion on or off:** reduced motion is read once at page load (`motionEnabled`), and `html.motion` is set from it. Changing the OS setting takes effect on reload.
  - Styles that depend on motion are scoped under `:global(html.motion)` or `:global(html:not(.motion))`.
  - Without motion, every element's CSS default is its final state, and no section render runs.
- **Phone breakpoint:** `max-width: 768px`. Phone checks run at 390x844.
- **Touch:** hover tilts (hero layer, project cards) only run when `matchMedia('(hover: hover)')` matches.
- **Build checks:** `npm run build` and `npm run lint` must pass with zero warnings after every task. `noUnusedLocals` and `noUnusedParameters` are on.
- **Base path:** `/Portfolio` stays in sync in `vite.config.ts`, `src/main.tsx` and `package.json`. Do not touch these files' base settings.
- **Skills:**
  - Before writing styles in Task 1, invoke `frontend-design` and `taste-skill:design-taste-frontend`. Where they conflict with the approved prototype, the prototype wins. Use them for what the prototype leaves open: focus and hover states, phone layouts, and small interaction details.
  - Use `playwright-cli` for every check.
  - Use `web-design-guidelines` in Task 11.
- **Folders:** new shared pieces go in `src/components/<Name>/` (with a co-located `<Name>.module.scss`) or `src/hooks/`.

## How checks work (no test runner)

There is no test runner, so each task's checks are browser assertions run with `playwright-cli` against the dev server.

- **When:** write a task's checks first, run them and watch them fail, then implement and run them until they pass.
- **Dev server:** start it once, in the background, with `npm run dev -- --port 5180 --strictPort`.
  - If it fails with "An Application Control policy has blocked this file" (Windows blocked rollup's native module), stop and tell Patrick.
  - Do not swap rollup packages.
- **Browser:** `playwright-cli -s=build open http://localhost:5180/Portfolio/` then `playwright-cli -s=build resize 1440 900`.
- **Running a check:** `playwright-cli -s=build eval "<expression>"`. Each check below gives its expression and the result that means it passed.
- **`__seek(id, progress, waitMs = 100)`:** a dev-only helper added in Task 1. It jumps to a chapter's progress and resolves once the frame has rendered. Use `waitMs = 1500` for anything that eases toward a target (project cards).
- **Phone and reduced motion:**
  - Phone checks: `resize 390 844` then `reload`.
  - Reduced-motion checks: `set-reduced-motion reduce` then `reload`.
  - Afterwards, `clear-reduced-motion`, `resize 1440 900`, `reload`.
- **Overflow:** every task's phone pass includes `document.documentElement.scrollWidth <= innerWidth` → `true`.
- **Visual comparison:** compare screenshots against the prototype. It is served by the brainstorm server (see its output file), or open the HTML file directly, where its images won't load.

## Review Focus

These five conditions are implied by the spec but easy to miss. Each one is covered by a check in the task named.

1. **Resizing the window mid-section** (a desktop window, or a phone rotating): rows and cards re-lay out with no overlap or stale positions. *Task 5, Task 8.*
2. **More projects or shorter screens:** projects added to `projectData.json`, or a 1024x700 laptop where the grid needs three rows. The gathered grid must still fit between the filters and the pill, so it scales down. *Task 8.*
3. **Arriving mid-page:** a deep link (`/Portfolio/#contact`) or a reload while scrolled. The page lands on the section, and the sections above and below are not blank or frozen half-way. *Task 10.*
4. **Keyboard-only visitors:** Tab never lands on something invisible (closed menu links, scattered cards, hidden filters), and focusing the projects filters jumps to the gathered grid. *Task 2, Task 8, Task 11.*
5. **Short laptop screens (1366x640):** absolutely positioned stage content must not overlap (statement over highlights, service panel under the pill, skill columns over the title). *Tasks 4, 6, 7.*

---

### Task 1: Foundation: theme, motion loop, Lenis

**Files:**
- Create: `src/hooks/motion/math.ts`, `src/hooks/motion/loop.ts`, `src/hooks/motion/useChapter.ts`
- Modify: `src/globals/global.scss` (rewrite), `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `index.html`, `package.json` (via npm)

**Interfaces:**
- Produces, in `math.ts` (ports of prototype lines 246–254):
  - `clamp(v: number, min: number, max: number): number`
  - `lerp(a: number, b: number, t: number): number`
  - `ease(t: number): number` (cubic in-out)
  - `easeOut(t: number): number` (cubic out)
  - `seg(p: number, a: number, b: number): number`
  - `bounce(x: number): number` (easeOutBounce)
  - `rnd(i: number, k: number): number` (sin hash, returns a value in [0, 1))
- Produces, in `loop.ts`:
  - `motionEnabled: boolean` (const)
  - `type ChapterRender = (progress: number, time: number) => void`
  - `startMotion(): () => void`
  - `registerChapter(el: HTMLElement, render: ChapterRender): () => void`
  - `scrollToSection(id: string): void`
  - `scrollToProgress(id: string, progress: number): void`
  - `pauseScroll(): void`
  - `resumeScroll(): void`
  - dev only: `window.__seek(id: string, progress: number, waitMs?: number): Promise<void>`
- Produces, in `useChapter.ts`: `useChapter(ref: RefObject<HTMLElement>, render: ChapterRender): void`
- Produces global classes:
  - `.chapter` is the tall wrapper that carries the section `id`.
  - `.stage` is sticky, 100vh and `overflow: hidden` only under `html.motion`. Otherwise it is `min-height: 100vh`, in normal flow.
  - Chapter labels: `.label`, `.label-l`, `.label-r` (12px, weight 600, 26px from the top and 32px from the sides).
  - Type and accessibility: `.serif`, `.visually-hidden`.

- [ ] **Step 1: Invoke the `frontend-design` and `taste-skill:design-taste-frontend` skills** and keep their guidance in mind for Tasks 1–10.
- [ ] **Step 2: Install Lenis.** Run `npm install lenis@^1.3.27`. If the install is refused, ask Patrick to run `! npm install lenis@^1.3.27`.
- [ ] **Step 3: Write the checks and run them.** All of them should fail now.

| Check | Expect |
|---|---|
| `['motion','lenis'].every(c => document.documentElement.classList.contains(c))` | `true` |
| `getComputedStyle(document.body).backgroundColor` | `"rgb(5, 5, 5)"` |
| `typeof window.__seek` | `"function"` |
| reduced motion: `document.documentElement.className.includes('motion')` | `false` |

- [ ] **Step 4: Rewrite `global.scss`.**
  - Fonts: `@import` Instrument Serif (`ital@0;1`) and Geist (`wght@400;500;600`).
  - Add the tokens from Global Constraints.
  - Base styles: body `background: var(--bg)`, `color: var(--text)`, Geist, antialiased, `overflow-x: hidden`.
  - Delete the old `scroll-behavior: smooth`, because Lenis owns scrolling.
  - Add the shared classes listed under Interfaces.
  - Focus: `:focus-visible` uses a 2px `--accent` outline on dark, and `--ink` inside paper surfaces.
  - Keep `.container`, `.section`, `.accent` and `.button` for now. Task 11 removes whichever are unused.
  - In `main.tsx`, `import 'lenis/dist/lenis.css'`.
- [ ] **Step 5: Implement `math.ts`.** Port the prototype helpers exactly.
- [ ] **Step 6: Implement `loop.ts`.**
  - `motionEnabled` is `!matchMedia('(prefers-reduced-motion: reduce)').matches`.
  - `startMotion()` is idempotent, so it survives StrictMode running effects twice.
    - It does nothing when `motionEnabled` is false.
    - Otherwise it creates `new Lenis({ lerp: 0.09, anchors: true })` and starts the frame loop from prototype lines 468–478.
    - The loop skips chapters more than 50px off screen.
    - Progress is `clamp(-rect.top / (el.offsetHeight - innerHeight), 0, 1)`.
    - The returned cleanup cancels the frame and destroys Lenis.
  - `registerChapter` adds the chapter to a `Set` and renders it once immediately, so the first paint never shows the CSS final state. It returns a function that unregisters it.
  - `scrollToSection` uses `lenis.scrollTo(el, { duration: 1.6 })`, or `el.scrollIntoView()` without Lenis.
  - `scrollToProgress` scrolls instantly to `el top + progress × (offsetHeight − innerHeight)`. With Lenis, use `{ immediate: true, force: true }`.
  - `pauseScroll` and `resumeScroll` call `lenis.stop()` and `lenis.start()`.
  - When `import.meta.env.DEV` is true, assign `window.__seek`. It calls `scrollToProgress`, waits `waitMs`, then waits two animation frames.
  - Declare `__seek?` on `Window` in `vite-env.d.ts`.
- [ ] **Step 7: Implement `useChapter`.**
  - It does nothing when `!motionEnabled`.
  - It stores the latest `render` in a ref, and registers `ref.current` in `useLayoutEffect` with an empty dependency list.
- [ ] **Step 8: Wire up the entry points.**
  - In `main.tsx`, before `createRoot`, run `document.documentElement.classList.toggle('motion', motionEnabled)`.
  - In `App.tsx`, add `useEffect(() => startMotion(), [])` and give `<main>` the attribute `id="main"`.
  - In `index.html`, add `<meta name="theme-color" content="#050505">`.
- [ ] **Step 9: Run the checks from Step 3.** All should pass.
- [ ] **Step 10: Run `npm run build` and `npm run lint`.** Both should pass with 0 warnings.

---

### Task 2: Floating pill and full-screen menu

**Files:**
- Create: `src/components/SiteNav/SiteNav.tsx`, `src/components/SiteNav/SiteNav.module.scss`
- Modify: `src/App.tsx`
- Delete: `src/components/Navbar/`, `src/components/ScrollTopButton/`

**Interfaces:**
- Consumes `scrollToSection(id)` from Task 1, and `cvUrl` from `links.ts`.
- Produces `SiteNav(): JSX.Element`, rendered in `App.tsx` outside `<main id="main">`.

The design follows prototype CSS lines 28–45 and script lines 262–269.

- The pill holds three things:
  - The "JP" mark: an `<a href="#home" aria-label="Back to top">` that calls `scrollToSection('home')`.
  - A Menu button: `aria-controls="site-menu"`, `aria-expanded`, with text that toggles between "Menu" and "Close".
  - "Download CV": `<a href={cvUrl} download>`.
- The menu is `<nav id="site-menu" aria-label="Sections">`, listing seven links `00 Home` … `06 Contact`.
  - It opens with the clip-path wipe, and its links get staggered `transition-delay`s.
  - When closed, it has `visibility: hidden`, with visibility transitioned after the wipe so that hidden links leave the tab order.
- Opening the menu:
  - sets `inert` on `#main` (use `toggleAttribute`)
  - moves focus to the first link
- Closing the menu, by Escape, the button or choosing a link:
  - removes `inert`
  - returns focus to the Menu button
- Choosing a link prevents the default jump, closes the menu, and calls `scrollToSection(id)`.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `btn` in these checks is `document.querySelector('[aria-controls=site-menu]')`.

| Check | Expect |
|---|---|
| `document.querySelector('a[download]').getAttribute('href')` | `"/Portfolio/Jan_Patrick_Matayabas_Software_Engineer_Resume.pdf"` |
| `[...document.querySelectorAll('#site-menu a')].every(a => getComputedStyle(a).visibility === 'hidden')` | `true` |
| `btn.click()`, then `[btn.textContent, btn.getAttribute('aria-expanded'), document.activeElement.getAttribute('href'), document.getElementById('main').inert]` | `["Close","true","#home",true]` |
| `press Escape`, then `[btn.getAttribute('aria-expanded'), document.activeElement === btn]` | `["false",true]` |
| open the menu, click its Projects link, wait 2500ms, then `Math.abs(document.getElementById('projects').getBoundingClientRect().top) < 2` | `true` |

- [ ] **Step 2: Implement `SiteNav` and its styles.** Replace `Navbar` and `ScrollTopButton` in `App.tsx`, then delete both folders.
- [ ] **Step 3: Run the checks.** They should all pass, at 1440x900 and at 390x844 (on a phone the pill must fit inside 358px).
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 3: Hero

**Files:**
- Create: `src/components/SplitText/SplitText.tsx`, `src/data/skills.ts`
- Modify: `src/components/Header/Header.tsx`, `src/components/Header/Header.module.scss` (rewrite)

**Interfaces:**
- Consumes `useChapter`, `motionEnabled`, `ease`, `seg`, `lerp`, `clamp` and `rnd` (Task 1), and `location` from `links.ts`.
- Produces `SplitText({ text, by, className, startIndex = 0, pieceStyle }: { text: string; by: 'char' | 'word'; className?: string; startIndex?: number; pieceStyle?: (index: number) => CSSProperties | undefined }): JSX.Element`.
  - It renders one `aria-hidden="true"` span. Inside are piece spans with `data-piece={startIndex + i}`.
  - When splitting by word, it keeps the spaces between words as text.
  - The parent supplies the accessible text in a `.visually-hidden` span.
- Produces, in `skills.ts`:
  - `type SkillGroup = 'Languages' | 'Frameworks' | 'AI' | 'Cloud & DevOps' | 'Data & tools'`
  - `skillGroups: SkillGroup[]`, in that order
  - `interface Skill { name: string; group: SkillGroup; color: string }`
  - `skills: Skill[]`: all 28 entries from today's `SkillsSection.tsx`, in the same order, with the same names and colors, and no icons. The `area` values map Language→Languages, Framework→Frameworks, AI→AI, Cloud & DevOps→Cloud & DevOps, Data and Tool→Data & tools. HTML and CSS stay separate.

Layout and motion follow prototype CSS lines 47–64 and script lines 271–300.

- The section's id stays `home`. The chapter is 230vh.
- Copy:
  - "Hi, I'm Patrick"
  - the h1: a visually hidden "Software Engineer", plus two `.line` wrappers that each contain a `SplitText` by char ("Software", then "Engineer" with `startIndex={8}`)
  - "for web, mobile, and *AI*", with "AI" in an `<em>`
- Stats: `3+` Years of experience, `5` Professional roles, `projects.length` (or `projectData.length` until Task 8) Projects built.
- Chapter labels: "Patrick Matayabas" on the left, `location` on the right.
- The CV button leaves the hero, because the pill now has it.
- Tool tiles use the `skills` entries named React, Next.js, TypeScript, Python, FastAPI, Flutter, AWS, Docker, Agentic AI (Claude), PostgreSQL, Laravel, Vue.js, Node.js, RAG, NGINX and Linux.
  - Each tile has `data-tile`.
  - On phones, use the first 10 and multiply the spread radius by 0.5.
- Letter rise: CSS transition, delay `200 + i × 45` ms. Add `loaded` to the section 50ms after mount.
- Mouse tilt applies only on hover devices.
- Without motion, render the tiles once at their resting p=0 position: no drift, no tilt, no listener.
- The hero copy wrapper gets `data-hero-copy`, and the stats row gets `data-stats`.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now.

| Check | Expect |
|---|---|
| `document.querySelectorAll('#home [data-tile]').length` | `16` (phone: `10`) |
| after 2s: `getComputedStyle(document.querySelector('#home [data-piece]')).transform` | `"none"` |
| `__seek('home', .5).then(() => +getComputedStyle(document.querySelector('[data-hero-copy]')).opacity)` | between `0.35` and `0.45` |
| `__seek('home', 1).then(() => +getComputedStyle(document.querySelector('[data-stats]')).opacity)` | `0` |
| `playwright-cli snapshot` | contains `heading "Software Engineer" [level=1]` |
| reduced: `[+getComputedStyle(document.querySelector('[data-hero-copy]')).opacity, document.getElementById('home').offsetHeight <= innerHeight + 1]` | `[1, true]` |

- [ ] **Step 2: Implement `skills.ts`, `SplitText` and the hero.**
- [ ] **Step 3: Run the checks at desktop, phone and reduced motion.** They should all pass. Then screenshot the hero at p = 0, .3 and .7 and compare it against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 4: About

**Files:**
- Modify: `src/components/AboutmeSection/AboutmeSection.tsx`, `src/components/AboutmeSection/AboutmeSection.module.scss` (rewrite)

**Interfaces:**
- Consumes `useChapter`, `SplitText`, `seg` and `easeOut`.

Layout and motion follow prototype CSS lines 66–73 and script lines 302–309. The chapter is 280vh.

- The statement is a visually hidden full sentence plus a `SplitText` by word: "3+ years building reliable software: web and mobile apps, AI products, and the cloud they run on."
- The four highlights keep today's titles and text exactly.
  - They have no icons and no links (my call; the spec left this to the builder).
  - They are four columns on desktop and two on phones.
- Chapter labels: "About Me" and "Chapter 01".
- On phones and on 1366x640 screens, the statement may get smaller (`clamp` font size). The highlights must sit below it without overlapping.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `bright` helper is `[...document.querySelectorAll('#about [data-piece]')].filter(w => +getComputedStyle(w).opacity > .9).length`.

| Check | Expect |
|---|---|
| `__seek('about', 0).then(() => bright)` | `0` |
| `__seek('about', .3).then(() => bright)` | between `1` and `15` (the statement has 16 words) |
| `__seek('about', 1).then(() => bright)` | `16` |
| at p=1, the four highlights have opacity `1`, and the first one's text is "Web and mobile apps with Next.js, Flutter, and FastAPI, including enterprise outage monitoring." | `true` |
| at 1366x640, 390x844 and 1440x900, with p=1: the statement's bottom is above the first highlight's top | `true` |
| reduced: `bright` | `16` |

- [ ] **Step 2: Implement the section.**
- [ ] **Step 3: Run the checks.** They should all pass. Then compare screenshots at p = .25 and .9 against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 5: Experience

**Files:**
- Create: `src/hooks/motion/layout.ts` (this task adds `experienceRows`; Task 8 adds `gridSlots`)
- Modify: `src/components/ExperienceSection/ExperienceSection.tsx`, `src/components/ExperienceSection/ExperienceSection.module.scss` (rewrite)

**Interfaces:**
- Consumes `useChapter` and `clamp`.
- Produces `experienceRows(P: number, heights: number[], o: { top: number; gap: number; step: number; width: number }): { x: number; y: number; scale: number; opacity: number; numScale: number }[]`.

The look follows prototype CSS lines 75–86 and script lines 311–336.

- The section uses the paper background with `border-radius: 28px 28px 0 0`.
- It has a fixed `x-head` gradient header reading "Where I've worked".
- Chapter labels: "My Experience" and "Chapter 02".
- Chapter height: `calc(100vh + (var(--rows) - 1) * 45vh)`, with `--rows` set inline to the job count.
- Each row (`data-row`) shows the date, title and company, then the index number (`01`…), then **every** item in `details` as a `<ul>`.
  - Desktop grid: `1.1fr 120px 1.4fr`.
  - Phone: one column, with the number at 48px above the text.
- Row heights are measured with a `ResizeObserver` on each row, so they stay right after resizes and font swaps.
- Each row's style is `translate3d(x, y, 0) scale(scale)` with `transform-origin: left top`. The number gets `scale(numScale)`. This keeps the prototype's narrowing look with transforms only, which the spec allows.
- Values:
  - desktop: `top 210`, `gap 36`, `step 64`, `width` = stage width − 64
  - phone: `top 170`, `gap 28`, `step 16`, `width` = stage width − 32
- Without motion, rows are an ordinary stacked list: static position, full width, `gap 36`.

`experienceRows` calculates each row's position from the active row outward. It does not use a fixed row pitch, so rows of different heights never overlap.

```
d = i - P
x = d > 0 ? d * step : 0
scale = d > 0 ? max(.5, (width - 2x) / width) : 1
opacity = d > 0 ? clamp(1 - .28d, .06, 1) : clamp(1 + 1.3d, 0, 1)
numScale = d > 0 ? clamp(1 - .28d, .2, 1) : 1
a = min(floor(P), n - 1), f = P - a
y[a] = top - f * (heights[a] + gap)
y[i > a] = y[i-1] + (heights[i-1] + gap) * scale[i-1]
y[i < a] = y[i+1] - (heights[i] + gap)
```

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `rows` in these checks are `[...document.querySelectorAll('#experience [data-row]')]`.

| Check | Expect |
|---|---|
| `rows.map(r => r.querySelectorAll('li').length)` | `[4,2,2,2,2,1]` |
| `getComputedStyle(document.getElementById('experience')).backgroundColor` | `"rgb(242, 239, 233)"` |
| for each p in `[0,.2,.5,.8,1]`, after `__seek('experience', p)`: among rows with opacity > .05, each row's rect bottom ≤ the next row's top + 1 | `true` |
| at each of those p values: the row at `Math.round(p*5)` has opacity > .95, top ≥ 0, and bottom ≤ innerHeight − 80 | `true` |
| at p=.5, resize to 1024x768, wait 300ms, then run the overlap check again | `true` |
| repeat the overlap and active-row checks at 390x844 | `true` |
| reduced: all rows have opacity `1`, `position` is `static`, and there is no overlap | `true` |

- [ ] **Step 2: Implement `experienceRows` and the section.**
- [ ] **Step 3: Run the checks.** They should all pass. Then compare screenshots at p = 0, .5 and 1 against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 6: Services

**Files:**
- Modify: `src/components/ServicesSection/ServicesSection.tsx`, `src/components/ServicesSection/ServicesSection.module.scss` (rewrite)

**Interfaces:**
- Consumes `useChapter` and `clamp`.

The look follows prototype CSS lines 88–99 and script lines 338–359. The chapter height is `calc(100vh + (var(--rows) - 1) * 80vh)`.

- Services move into a `services` array in the component. Each entry is `{ title, description, stat, statCaption }`.
- Titles and descriptions are today's text, word for word. The `<strong>` emphasis is dropped, because the stat now carries the highlight.

| title | description | stat | statCaption |
|---|---|---|---|
| Web Developer | 3+ years building fast, reliable web apps that are easy to maintain and extend, from enterprise outage monitoring to point-of-sale systems. | 3+ | years building web apps |
| AI Integrated developer | Faster feature delivery with agentic AI development using Claude, while keeping code secure and maintainable. I also build AI products, including a RAG assistant. | RAG | AI assistant I built |
| DevOps Engineer | Streamlined pipelines improved deployment speed by 60% and cut downtime by 40% in my projects. I also run secure production infrastructure on AWS. | 60% | faster deployments |

The captions are my call. The prototype's "assistant in production" claimed more than today's copy says.

- Chapter labels: "Services" and "Chapter 03".
- The headline is "What I bring".
- Each panel has `data-service`.
- On phones, panels are `calc(100vw - 32px)` wide, with one column (the stat goes below the text). The stacking motion stays the same.
- Without motion, the panels are stacked in normal flow with 24px between them.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `panels` in these checks are the three `[data-service]` elements.

| Check | Expect |
|---|---|
| `panels[2].querySelector('p').textContent` | today's DevOps sentence, exactly as in the table |
| `__seek('services', 0)`: panel 1 is in the viewport, and panels 2 and 3 have rect top ≥ innerHeight − 1 | `true` |
| `__seek('services', .5)`: panel 2 is fully in view, and panel 1's rect width is less than panel 2's | `true` |
| `__seek('services', 1)`: panel 3 has top ≥ 0 and bottom ≤ innerHeight − 80 | `true` |
| at 1440x900, 1366x640 and 390x844: every panel's `scrollHeight <= clientHeight` (no clipped copy) | `true` |
| reduced: three panels, each with no transform and opacity `1` | `true` |

- [ ] **Step 2: Implement the section.**
- [ ] **Step 3: Run the checks.** They should all pass. Then compare screenshots against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 7: Skills

**Files:**
- Modify: `src/components/SkillsSection/SkillsSection.tsx`, `src/components/SkillsSection/SkillsSection.module.scss` (rewrite)

**Interfaces:**
- Consumes `skills`, `skillGroups`, `useChapter`, `seg`, `bounce` and `rnd`.

The look follows prototype CSS lines 101–109 and script lines 361–382. The chapter is 230vh.

- Chapter labels: "Skills" and "Chapter 04".
- The headline is "The tools / I work with".
- The section has one column (`data-group`, headed by an `h3`) per `skillGroups` entry. Each column is a flex column-reverse, so tiles stack from the bottom.
- Each tile (`data-skill`) shows a colored dot and the tool's name.
- Tiles drop in a shuffled order, using `rnd(i, 9)`, with the bounce and rotation from the prototype.
- On phones, the groups stack as rows instead. Each row is a label above a wrapping line of tiles (13px text, 8px 10px padding, 6px gap), and the tiles drop the same way.
- Remove every Swiper import.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `tiles` in these checks are `[...document.querySelectorAll('#skills [data-skill]')]`.

| Check | Expect |
|---|---|
| `[...document.querySelectorAll('#skills [data-group] h3')].map(h => h.textContent)` | `["Languages","Frameworks","AI","Cloud & DevOps","Data & tools"]` |
| `tiles.length` | `28` |
| `__seek('skills', 0).then(() => tiles.filter(t => t.getBoundingClientRect().bottom > 0).length)` | `0` |
| `__seek('skills', 1)`: every tile lies inside its group's rect (±1px), and below the headline's bottom | `true` |
| repeat the p=1 check at 1366x640 and 390x844, adding: every tile's bottom ≤ innerHeight − 80 | `true` |
| `document.querySelector('.swiper')` | `null` |

- [ ] **Step 2: Implement the section.**
- [ ] **Step 3: Run the checks, including reduced motion,** where all tiles must be in place at their natural positions. They should all pass. Then compare screenshots against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 8: Projects: scatter, gather, filters, tilt

**Files:**
- Create: `src/data/projects.ts`
- Modify: `src/hooks/motion/layout.ts` (add `gridSlots`), `src/components/ProjectContainerSection/ProjectContainerSection.tsx`, `src/components/ProjectContainerSection/ProjectContainerSection.module.scss` (rewrite), `src/components/Header/Header.tsx` (switch to `projects.length`)
- Delete: `src/components/ProjectContainerSection/FeaturedProjectComponent/`

**Interfaces:**
- Consumes `useChapter`, `scrollToProgress`, `motionEnabled`, `ease`, `seg`, `lerp`, `clamp` and `rnd`.
- Produces, in `projects.ts`:
  - `interface Project { title: string; category: string; description: string; contributionTitle: string; contribution: string; functionTitle: string; functionDescription: string; imageAlt: string; imageUrl: string; url: string; offline?: boolean }`
  - `projects: Project[]`
  - `projectCategories: string[]`: unique categories in the order they first appear in the data
  - `projectImage(p: Project): string | undefined`: returns `new URL(\`../assets/${p.imageUrl}\`, import.meta.url).href`, or `undefined` when `imageUrl` is empty
- Produces, in `layout.ts`: `gridSlots(count: number, o: { cols: number; cellW: number; cellH: number; offsetY: number; availW: number; availH: number }): { x: number; y: number; scale: number }[]`
  - `k = min(1, availW / (cols·cellW), availH / (rows·cellH))`
  - Rows are centred, with the last row centred on its own (as in prototype lines 417–425).
  - Offsets are multiplied by `k`, and every slot gets `scale: k`.
- Produces the section's open handler, `onOpen(project: Project, opener: HTMLElement)`, which Task 9 fills in. For now, use `useState<{ project: Project; opener: HTMLElement } | null>`.

Layout and motion follow prototype CSS lines 111–126 and script lines 384–442. The chapter is 260vh.

- Chapter labels: "Selected Work" and "Chapter 05".
- The headline is "Things I've built". It starts huge in the centre and shrinks to the top.
- Each card is `<button type="button" data-card aria-label="{title} ({category}): view details">` containing:
  - the image (`alt=""`), or a placeholder `div` with an ember glow showing "AI" (or the category's initials)
  - the category chip
  - the title
  - "View details →"
- Grid values:
  - desktop: cards 204×252, `cellW 228`, `cellH 272`, `cols = clamp(floor((innerWidth − 120) / 228), 2, 5)`
  - phone: cards 108×140 with the chip and "View details" hidden, `cellW 116`, `cellH 148`, `cols 3`. The spec suggested two columns, but two columns of nine cards cannot fit a pinned 844px stage.
  - both: `availW = innerWidth − 32`, `availH = innerHeight − 290`, `offsetY = 55` (the grid sits between a 200px top band and the 90px pill)
- Recompute the slots on resize and on filter change.
- Scatter positions are spread × 0.5 on phones.
- Filters are a `role="group"` with `aria-label="Filter projects"`, holding "All" plus `projectCategories`, each with `aria-pressed`.
  - They fade in at p .62–.75, and their pointer events turn on after p .7.
  - On phones, if they don't fit, the row scrolls sideways (`overflow-x: auto`) without widening the page.
  - Filtered-out cards go back to `.2` opacity and their scatter depth, with pointer events off.
- The render writes each card's `tabIndex`:
  - `0` when the grid is gathered (`g > .95`) and the card matches the filter
  - `-1` otherwise
- When focus enters the filter group while `g < .95`, call `scrollToProgress('projects', .8)`.
- Cards tilt toward the mouse only on hover devices and only when gathered.
- Without motion, the cards sit in a CSS grid in normal flow (`repeat(auto-fill, minmax(204px, 1fr))`), and filtered-out cards are `hidden`.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now.
  - `cards` is `[...document.querySelectorAll('#projects [data-card]')]`.
  - `inBand` means every matching card's rect lies within `[180, innerHeight − 80]` vertically and `[0, innerWidth]` horizontally, with no two rects overlapping.

| Check | Expect |
|---|---|
| `cards.length` | `9` |
| the filter buttons' text | `["All","AI","Front End","Full Stack","DevOps"]` |
| `__seek('projects', 0)`, then `[cards.every(c => c.tabIndex === -1), +getComputedStyle(document.querySelector('[aria-label="Filter projects"]')).opacity]` | `[true, 0]` |
| `__seek('projects', 1, 1500)`, then `cards.every(c => c.tabIndex === 0)` and `inBand` | `true` |
| click "DevOps" and wait 1500ms: count of cards with opacity > .9 and `tabIndex` 0 | `1` |
| click "All" and wait 1500ms | all 9 cards are back, `inBand` |
| at 1024x700 (three rows) with p=1: `inBand` | `true` |
| resize 1440x900 → 1024x768 while gathered, wait 1500ms: `inBand` | `true` |
| at 390x844 with p=1: `inBand`, with cards in 3 columns | `true` |
| `__seek('projects', 0)`, then `document.querySelector('[aria-label="Filter projects"] button').focus()`, wait 500ms: progress ≥ .7 | `true` |
| `[...document.querySelectorAll('#projects img')].every(i => i.complete && i.naturalWidth > 0)` | `true` |
| reduced: click "DevOps", then `cards.filter(c => !c.hidden).length` | `1` |

- [ ] **Step 2: Implement `projects.ts`, `gridSlots` and the section.** Delete `FeaturedProjectComponent`.
- [ ] **Step 3: Run the checks.** They should all pass. Then compare screenshots at p = 0, .4 and 1 against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 9: Project detail panel

**Files:**
- Create: `src/components/ProjectDetail/ProjectDetail.tsx`, `src/components/ProjectDetail/ProjectDetail.module.scss`
- Modify: `src/components/ProjectContainerSection/ProjectContainerSection.tsx`

**Interfaces:**
- Consumes `Project` and `projectImage` (Task 8), and `pauseScroll` and `resumeScroll` (Task 1).
- Produces `ProjectDetail({ project, opener, onClose }: { project: Project | null; opener: HTMLElement | null; onClose: () => void }): JSX.Element`.

The look follows prototype CSS lines 128–141 and script lines 444–453.

- The panel is a native `<dialog>` opened with `showModal()`, which gives a modal role and an inert page behind it. It has `aria-labelledby` pointing at its title.
  - Styling: the dialog itself fills the viewport and is transparent. `::backdrop` has `rgba(5,5,5,.7)` and a 6px blur. The panel sits in the centre.
  - Clicking the dialog element itself (outside the panel) closes it.
  - The `cancel` event (Escape) is prevented, and the panel closes with the same animated close as the other two ways.
- Animated close: remove the `open` class, wait 350ms, call `dialog.close()`, call `resumeScroll()`, then focus `opener`.
- Opening calls `pauseScroll()` and sets `overflow: hidden` on `<html>` (for native touch scrolling). Closing restores it.
- Content, in order:
  - the image with `imageAlt`, or the card's placeholder
  - the category
  - the title, in serif
  - `description`
  - `contributionTitle` and `contribution`
  - `functionTitle` and `functionDescription`
  - "Visit project →" (`target="_blank" rel="noopener noreferrer"`), shown only when `url` is set; "Website is no longer up" when `offline` is true
  - a Close button
- On phones it is a full-screen sheet, with the image on top.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. Each check starts with the grid gathered, from `__seek('projects', 1, 1500)`. `dlg` is `document.querySelector('dialog')`.

| Check | Expect |
|---|---|
| click the Dominus card, then `[!!document.querySelector('dialog[open]'), dlg.querySelector('h3').textContent, dlg.querySelector('a[target=_blank]').href, dlg.contains(document.activeElement)]` | `[true,"Dominus","https://dominus.arisenlab.org/",true]` |
| the panel's text includes "My Contribution" and "Function" | `true` |
| `press Escape` and wait 500ms: `[!document.querySelector('dialog[open]'), document.activeElement.getAttribute('aria-label').startsWith('Dominus')]` | `[true,true]` |
| open Cafe Klang: there is no `a[target=_blank]`, and the text includes "Website is no longer up" | `true` |
| open AI-Powered Social Calendar: there is no link and no offline text | `true` |
| open a card, run `dlg.dispatchEvent(new MouseEvent('click', {bubbles: true}))` (a click on the backdrop area), and wait 500ms: closed | `true` |
| open a card, click Close, wait 500ms: closed | `true` |
| while it is open: note `scrollY`, `mousewheel 0 800`, wait 500ms, `scrollY` is unchanged | `true` |
| at 390x844: the panel's rect width equals `innerWidth` | `true` |

- [ ] **Step 2: Implement `ProjectDetail`** and render it from the projects section.
- [ ] **Step 3: Run the checks.** They should all pass.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 10: Contact and footer

**Files:**
- Modify: `src/components/ContactSection/ContactSection.tsx`, `src/components/ContactSection/ContactSection.module.scss` (rewrite), `src/App.tsx`
- Delete: `src/components/Footer/`

**Interfaces:**
- Consumes `useChapter`, `SplitText`, `seg`, `bounce` and `easeOut`, plus `contactEmail`, `location` and `socialLinks` from `links.ts`.

Layout and motion follow prototype CSS lines 143–152 and script lines 455–465. The chapter is 220vh.

- The headline is a visually hidden "Let's talk", plus two `SplitText` lines by char: "Let's", and "talk" with `startIndex={5}`.
- Chapter labels: "Contact" and "Chapter 06".
- The info block holds:
  - `location` alone, with no availability status
  - the email as a large serif `mailto:` link
  - `socialLinks` as text links (`target="_blank" rel="noopener noreferrer"`)
- The footer line reads `© {new Date().getFullYear()} Patrick Matayabas`. There is no "Built with React" line.
- The CV link lives only in the pill.
- Remove `Footer` from `App.tsx` and delete it.

- [ ] **Step 1: Write the checks and run them.** All of them should fail now. The `letters` in these checks are `[...document.querySelectorAll('#contact [data-piece]')]`.

| Check | Expect |
|---|---|
| `letters.length` | `9` |
| `__seek('contact', 0)`, then `letters.every(l => l.getBoundingClientRect().bottom < 0)` | `true` |
| `__seek('contact', 1)`: every letter's transform is `none` or has translation under 1px, and the info block's opacity is `1` | `true` |
| `document.querySelector('#contact').innerText` includes "Davao City, Philippines" and `© 2026 Patrick Matayabas`, and does not include "Open to work" or "Built with React" | `true` |
| `document.querySelector('#contact a[href^=mailto]').getAttribute('href')` | `"mailto:patmatayabas@gmail.com"` |
| `document.querySelectorAll('#contact a[target=_blank]').length` | `3` |
| open `http://localhost:5180/Portfolio/#contact` fresh and wait 1500ms: `Math.abs(document.getElementById('contact').getBoundingClientRect().top) < 2`, and the letters match p≈0 | `true` |
| at `__seek('skills', .5)`, `reload` and wait 1500ms: the scroll position is restored (skills progress is within .02 of .5), and the number of tiles with bottom > 0 is between 1 and 27 | `true` |
| at 390x844 and in reduced motion: every letter is in the viewport at p=1 (reduced: always), with no overflow | `true` |

- [ ] **Step 2: Implement the section**, remove `Footer`, and delete its folder.
- [ ] **Step 3: Run the checks.** They should all pass. Then compare screenshots against the prototype.
- [ ] **Step 4: Run build and lint.** Both should pass.

---

### Task 11: Cleanup, docs, full verification, design review

**Files:**
- Modify: `package.json` and `package-lock.json` (via npm), `src/globals/global.scss`, `.gitignore`, `DESIGN.md` (rewrite), `CLAUDE.md`
- Delete: `src/components/SectionHeading/` (if nothing imports it)

- [ ] **Step 1: Remove unused dependencies.** For each of `swiper`, `react-awesome-reveal`, `animate.css` and `@emotion/react`, confirm with Grep that nothing in `src/` imports it. Then run `npm uninstall` on the ones that are unused.
- [ ] **Step 2: Delete dead code.** Grep for `SectionHeading`, `className="container"`, `"section"`, `"accent"` and `"button"`. Delete `SectionHeading` and any global classes that are no longer used.
- [ ] **Step 3: Update `.gitignore`.** Append `.superpowers/`, and keep the `.playwright-cli/` entry.
- [ ] **Step 4: Rewrite `DESIGN.md`** for this design system:
  - the token table
  - type
  - chapter labels
  - the pill and menu
  - the motion rules: chapters, the loop, transform-only, reduced motion, phones
  - how to add a section
- [ ] **Step 5: Update `CLAUDE.md`.**
  - Architecture:
    - Navigation is `SiteNav` (the pill and menu). `Navbar` and `Footer` no longer exist.
    - `links.ts` is shared by the pill, hero and contact section.
    - Motion lives in `src/hooks/motion/`.
  - Styling: the new token names, what `--accent` means, and the pointer to `DESIGN.md`.
- [ ] **Step 6: Tab through the whole page.** Run a full keyboard pass with `playwright-cli -s=build run-code`: press Tab 45 times, waiting 200ms after each. Each time, check that `document.activeElement` is not `body`, and that it and its ancestors have opacity > 0 and visibility `visible`. Expect `true` every time.
- [ ] **Step 7: Run the full sweep.**
  - Screenshot every section at p = 0, .5 and 1, at 1440x900, 1366x640 and 390x844, and in reduced motion.
  - `playwright-cli -s=build console error` should show 0 errors.
  - In a `playwright-cli -s=mobile open --mobile` session, confirm that scrolling is native (there is no `lenis-smooth` class while touch-scrolling) and that cards don't tilt.
- [ ] **Step 8: Run a design review.** Invoke `web-design-guidelines` over every file changed in Tasks 1–10, and fix what it finds. Then re-run that task's checks for each fix.
- [ ] **Step 9: Check the production build.**
  - Run `npm run build`, `npm run lint` and `npm run preview`.
  - At `http://localhost:4173/Portfolio/`, project images load, the CV link downloads, and there are no console errors.

---

### Task 12: Compress project images (on hold until Patrick picks a tool)

There is no image tool in the project. A `npx sharp-cli` download was blocked during planning, so Patrick chooses how to do this:

- allow `npx sharp-cli`
- add `sharp` as a dev dependency
- compress the images himself (for example with squoosh.app)
- skip compression

**Files:**
- Modify: `src/assets/*` and `src/data/projectData.json` (`imageUrl` values)

- [ ] **Step 1: Convert the images.** Convert the seven images to WebP at no more than 1200px wide, quality 78.
- [ ] **Step 2: Update the data.** Point the `imageUrl` values at the new files (the names are case-sensitive), then delete the originals.
- [ ] **Step 3: Re-run the image checks.** Re-run Task 8's image check and Task 9's Dominus check. Then run `npm run build` and confirm that `dist/assets` is under 1 MB of images.
