import { useEffect, useState } from 'react';

// True while the media query matches, e.g. useMediaQuery('(max-width: 768px)') for phones
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const PHONE = '(max-width: 768px)';
export const HOVER = '(hover: hover)';
