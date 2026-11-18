import { MouseEvent, useEffect, useRef, useState } from 'react';
import { cvUrl } from '../../data/links';
import { scrollToSection } from '../../hooks/motion/loop';
import styles from './SiteNav.module.scss';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// The floating pill at the bottom of every screen, and the full-screen section menu it opens
const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);
  // The section chosen from the menu; it takes focus once the page behind the menu is live again
  const chosen = useRef<string | null>(null);

  useEffect(() => {
    // While the menu is open, the page behind it is out of reach for keyboard and screen readers
    document.getElementById('main')?.toggleAttribute('inert', open);
    if (open) {
      firstLink.current?.focus();
    } else if (wasOpen.current) {
      const section = chosen.current ? document.getElementById(chosen.current) : null;
      if (section) {
        // Tab then continues inside the chosen section instead of back at the pill
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      } else {
        menuButton.current?.focus();
      }
    }
    chosen.current = null;
    wasOpen.current = open;
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const goTo = (e: MouseEvent, id: string) => {
    e.preventDefault();
    if (open) chosen.current = id;
    setOpen(false);
    scrollToSection(id);
  };

  const skipToContent = (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <>
      <a href="#main" className="skip-link" onClick={skipToContent}>
        Skip to content
      </a>

      <div className={styles.pill} data-pill>
        <a href="#home" className={styles.mark} aria-label="Back to top" onClick={(e) => goTo(e, 'home')}>
          JP
        </a>
        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-controls="site-menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <a href={cvUrl} className={styles.cv} download>
          Download CV
        </a>
      </div>

      <nav id="site-menu" aria-label="Sections" className={`${styles.menu} ${open ? styles.open : ''}`}>
        {sections.map(({ id, label }, i) => (
          <a
            key={id}
            ref={i === 0 ? firstLink : undefined}
            href={`#${id}`}
            className={`serif ${styles.link}`}
            style={{ transitionDelay: open ? `${i * 50 + 150}ms` : '0ms' }}
            onClick={(e) => goTo(e, id)}
          >
            <small>{String(i).padStart(2, '0')}</small>
            {label}
          </a>
        ))}
      </nav>
    </>
  );
};

export default SiteNav;
