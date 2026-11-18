import Lenis from 'lenis';
import { clamp } from './math';

// Read once at load. Changing the OS setting takes effect on the next visit or reload.
export const motionEnabled =
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// progress is 0 when the chapter's top reaches the viewport top, 1 when its bottom reaches the
// viewport bottom. Renderers write styles straight to elements; they never set React state.
export type ChapterRender = (progress: number, time: number) => void;

interface Chapter {
  el: HTMLElement;
  render: ChapterRender;
}

const chapters = new Set<Chapter>();
let lenis: Lenis | null = null;
let frameId = 0;

export const chapterProgress = (el: HTMLElement) => {
  const total = el.offsetHeight - window.innerHeight;
  const top = el.getBoundingClientRect().top;
  if (total <= 0) return top <= 0 ? 1 : 0;
  return clamp(-top / total, 0, 1);
};

const renderChapter = (chapter: Chapter, time: number) => {
  const rect = chapter.el.getBoundingClientRect();
  if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;
  chapter.render(chapterProgress(chapter.el), time);
};

const frame = (time: number) => {
  lenis?.raf(time);
  // Read every chapter's position before any renderer writes styles, so layout is computed once
  const due: [Chapter, number][] = [];
  chapters.forEach((chapter) => {
    const rect = chapter.el.getBoundingClientRect();
    if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;
    due.push([chapter, chapterProgress(chapter.el)]);
  });
  due.forEach(([chapter, progress]) => chapter.render(progress, time));
  frameId = requestAnimationFrame(frame);
};

// Starts Lenis and the frame loop. Safe to call twice (StrictMode); the cleanup stops both.
export function startMotion(): () => void {
  if (!motionEnabled || frameId) return () => {};
  // In-page links (menu, JP mark, skip link) do their own scrolling, so Lenis's anchor handling stays off
  lenis = new Lenis({ lerp: 0.09 });
  frameId = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lenis?.destroy();
    lenis = null;
  };
}

// Registers a section and renders it once straight away, so the first paint is never the
// final state the CSS defaults to.
export function registerChapter(el: HTMLElement, render: ChapterRender): () => void {
  const chapter = { el, render };
  chapters.add(chapter);
  renderChapter(chapter, performance.now());
  return () => {
    chapters.delete(chapter);
  };
}

// Where a link to a section lands, as chapter progress. Most land at their start; contact starts
// empty (its letters haven't fallen yet), so a link to it lands where the details are showing.
const landingProgress: Record<string, number> = { contact: 1 };

const chapterTarget = (el: HTMLElement, progress: number) =>
  el.getBoundingClientRect().top + window.scrollY + progress * Math.max(0, el.offsetHeight - window.innerHeight);

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(chapterTarget(el, landingProgress[id] ?? 0), { duration: 1.6 });
  else el.scrollIntoView();
}

// Jumps straight to a point inside a chapter, e.g. 0.8 of the way through the projects section
export function scrollToProgress(id: string, progress: number): void {
  const el = document.getElementById(id);
  if (!el) return;
  const target = chapterTarget(el, progress);
  if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
  else window.scrollTo(0, target);
}

// Lands on the section a link names, e.g. /Portfolio/#projects. React renders after the browser's
// own jump to the anchor, so this runs once the sections exist. A reload keeps its own position.
export function scrollToHash(): void {
  let id = '';
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return; // a malformed hash such as #100% names no section
  }
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!id || navigation?.type === 'reload') return;
  scrollToProgress(id, landingProgress[id] ?? 0);
}

export function pauseScroll(): void {
  lenis?.stop();
}

export function resumeScroll(): void {
  lenis?.start();
}

if (import.meta.env.DEV) {
  // Browser checks use this to jump to a chapter's progress and wait for the frame to render
  window.__seek = async (id, progress, waitMs = 100) => {
    scrollToProgress(id, progress);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };
}
