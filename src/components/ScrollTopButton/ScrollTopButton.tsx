import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './ScrollTopButton.module.scss';

const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScrollTopButton = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (progress < 0.02) return null;

  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <svg className={styles.ring} viewBox="0 0 46 46" aria-hidden="true">
        <circle
          cx="23"
          cy="23"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <FaArrowUp aria-hidden="true" />
    </button>
  );
};

export default ScrollTopButton;
