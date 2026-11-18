import { useRef } from 'react';
import { easeOut, seg } from '../../hooks/motion/math';
import { useChapter } from '../../hooks/motion/useChapter';
import SplitText from '../SplitText/SplitText';
import styles from './AboutmeSection.module.scss'

const statement = '3+ years building reliable software: web and mobile apps, AI products, and the cloud they run on.';

const highlights = [
  {
    title: 'Full-Stack Apps',
    text: 'Web and mobile apps with Next.js, Flutter, and FastAPI, including enterprise outage monitoring.',
  },
  {
    title: 'AI Products',
    text: 'RAG, LLM integration, and agentic AI with Claude, built into real products.',
  },
  {
    title: 'APIs and Cloud',
    text: 'Secure, scalable APIs running on AWS infrastructure.',
  },
  {
    title: 'Education',
    text: 'BS in Information Technology from Ateneo de Davao University, June 2025.',
  },
];

const AboutmeSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const statementEl = useRef<HTMLParagraphElement>(null);
  const highlightEls = useRef<(HTMLElement | null)[]>([]);

  // Words brighten one by one over the first half, then the highlights rise in
  useChapter(chapter, (p) => {
    const words = statementEl.current?.querySelectorAll<HTMLElement>('[data-piece]') ?? [];
    words.forEach((word, i) => {
      const a = (i / words.length) * 0.5;
      word.style.opacity = `${0.14 + 0.86 * seg(p, a, a + 0.1)}`;
    });
    highlightEls.current.forEach((el, i) => {
      if (!el) return;
      const k = easeOut(seg(p, 0.62 + i * 0.05, 0.8 + i * 0.05));
      el.style.transform = `translateY(${(1 - k) * 70}px)`;
      el.style.opacity = `${k}`;
    });
  });

  return (
    <section id="about" ref={chapter} className={`chapter ${styles.about}`}>
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">About Me</span>
        <span className="label label-r">Chapter 01</span>

        <h2 className="visually-hidden">About me</h2>
        <p ref={statementEl} className={`serif ${styles.statement}`} data-statement>
          <span className="visually-hidden">{statement}</span>
          <SplitText text={statement} by="word" />
        </p>

        <div className={styles.highlights}>
          {highlights.map(({ title, text }, i) => (
            <article key={title} ref={(el) => (highlightEls.current[i] = el)} className={styles.highlight} data-highlight>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutmeSection
