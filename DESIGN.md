# Design system

The portfolio is a black, editorial page where every section pins to the screen and plays out as you scroll. The look and motion come from the approved prototype described in `docs/superpowers/specs/2026-11-10-portfolio-redesign-design.md`. Read this before any UI work.

## Colors

The tokens are defined on `:root` in `src/globals/global.scss`, so modules use them without importing anything.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#050505` | Page background |
| `--surface` | `#111111` | Raised dark elements |
| `--line` | `rgba(242,239,233,.1)` | Hairlines and borders on dark |
| `--text` | `#f2efe9` | Main text on dark (warm off-white) |
| `--muted` | `#8d8983` | Secondary text on dark |
| `--accent` | `#ff5a36` | Ember orange, used sparingly |
| `--paper` | `#f2efe9` | Cards, service panels, the experience section, the detail panel |
| `--ink` | `#0a0a0a` | Text on paper |
| `--ink-muted` | `#6f6a63` | Secondary text on paper |

- `--accent` is only for the hero's "AI", link and menu hovers, and the glow on projects without a screenshot. Never use pink.
- Skill tiles keep each tool's brand color for their dot (`src/data/skills.ts`).
- Focus rings are a 2px `--accent` outline on dark. Inside an element with the `on-paper` class they switch to `--ink`.

## Type

- **Display:** Instrument Serif via the global `.serif` class: uppercase, line-height .86, letter-spacing -.01em. It sets section headlines, big numbers, the menu and the contact headline.
- **Body and UI:** Geist, weights 400, 500 and 600.
- Both load from Google Fonts through `<link>` tags in `index.html`.
- Visible copy uses typographic apostrophes (’), and headings balance their lines with `text-wrap: balance`.

## Recurring pieces

- **Chapter labels:** 12px semibold text in the top corners of every section, using `.label` with `.label-l` or `.label-r`. The left label names the section ("About Me") and the right gives its chapter number ("Chapter 01"). The hero shows the name and location instead.
- **Pill (`SiteNav`):** fixed at the bottom centre of the screen. It holds the "JP" mark (back to top), a Menu/Close button and "Download CV". There is no top navigation bar.
- **Menu:** a full-screen black overlay revealed with a clip-path wipe. It lists the seven sections in large serif and smooth-scrolls to the one you choose. While it is open, `#main` is inert and Escape closes it.
- **Project detail:** a native `<dialog>` opened with `showModal()`. It closes with its Close button, a backdrop click or Escape, and returns focus to the card that opened it.

## Motion

- **Chapters:** every section is a tall `.chapter` (it carries the section `id`) with a `.stage` inside. Under `html.motion` the stage is sticky and 100vh, so it stays pinned while the chapter scrolls past. The chapter's height in its module sets how long the section plays (`:global(html.motion) .x { height: 260vh; }`).
- **One loop:** `src/hooks/motion/loop.ts` runs Lenis smooth scrolling and a single `requestAnimationFrame` loop. Each frame it gives every on-screen chapter its progress, which is 0 when the chapter's top reaches the viewport top and 1 when its bottom reaches the viewport bottom.
- **Rendering:** a section subscribes with `useChapter(ref, (progress, time) => ...)`. Its render function writes `transform`, `opacity`, `filter` or `visibility` straight to elements through refs. Never animate layout properties, and never set React state per frame.
- **Helpers:** `math.ts` has `clamp`, `lerp`, `ease`, `easeOut`, `seg` (progress through a sub-range), `bounce` and `rnd` (stable pseudo-random). `layout.ts` has the pure layout functions for experience rows and the project grid.
- **Reduced motion:** read once at load (`motionEnabled`). Without motion, `html` lacks the `motion` class, there is no Lenis and no pinning, and no render function runs. Every element's CSS default must therefore be its final, readable state, and anything that differs with motion is scoped under `:global(html.motion)` or `:global(html:not(.motion))`.
- **Phones:** the breakpoint is `max-width: 768px` (`PHONE` in `src/hooks/useMediaQuery.ts`). Lenis leaves touch scrolling native. Hover effects (the hero layer tilt, project card tilt) only run when `(hover: hover)` matches.
- **Overflow:** horizontal overflow is clipped on `html`, never on `body`. If `body` clipped it, it would become the scroll container whenever `html`'s overflow changes, and every pinned stage would unstick.

## Adding a section

1. Create `src/components/<Name>/<Name>.tsx` and `<Name>.module.scss`.
2. Render `<section id="..." ref={chapter} className={`chapter ${styles.x}`}>` with a `<div className="stage">` inside, plus its two chapter labels.
3. Give it a height under `:global(html.motion)`, and lay out the stage so that its CSS default is the finished state.
4. Animate it with `useChapter`, writing styles through refs.
5. Add it to `App.tsx` and to the `sections` list in `SiteNav.tsx`.
6. Check it at 1440x900, 1366x640 and 390x844, and with reduced motion on.
