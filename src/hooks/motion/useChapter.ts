import { RefObject, useLayoutEffect, useRef } from 'react';
import { ChapterRender, motionEnabled, registerChapter } from './loop';

// Drives a section from the shared frame loop. The latest render function is always used,
// so it can read current props and refs without re-registering.
export function useChapter(ref: RefObject<HTMLElement>, render: ChapterRender): void {
  const renderRef = useRef(render);
  renderRef.current = render;

  useLayoutEffect(() => {
    if (!motionEnabled || !ref.current) return;
    return registerChapter(ref.current, (progress, time) => renderRef.current(progress, time));
  }, [ref]);
}
