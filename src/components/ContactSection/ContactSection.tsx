import { useRef } from 'react';
import { contactEmail, location, socialLinks } from '../../data/links';
import { chapterProgress, motionEnabled, scrollToProgress } from '../../hooks/motion/loop';
import { bounce, easeOut, seg } from '../../hooks/motion/math';
import { useChapter } from '../../hooks/motion/useChapter';
import SplitText from '../SplitText/SplitText';
import styles from './ContactSection.module.scss';

const ContactSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const info = useRef<HTMLDivElement>(null);

  // The letters tumble down from above and bounce into place, then the details fade up
  useChapter(chapter, (p) => {
    const letters = headline.current?.querySelectorAll<HTMLElement>('[data-piece]') ?? [];
    letters.forEach((letter, i) => {
      const a = 0.04 + i * 0.045;
      const q = seg(p, a, a + 0.28);
      const fall = (1 - bounce(q)) * window.innerHeight * 0.9;
      letter.style.transform = `translateY(${-fall}px) rotate(${(1 - q) * (i % 2 ? -45 : 45)}deg)`;
    });
    if (info.current) {
      const k = easeOut(seg(p, 0.55, 0.8));
      info.current.style.opacity = `${k}`;
      info.current.style.transform = `translateY(${(1 - k) * 40}px)`;
    }
  });

  return (
    <section id="contact" ref={chapter} className={`chapter ${styles.contact}`}>
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">Contact</span>
        <span className="label label-r">Chapter 06</span>

        <h2 ref={headline} className={`serif ${styles.headline}`}>
          <span className="visually-hidden">Let’s talk</span>
          <SplitText text="Let’s" by="char" className={styles.letter} />
          <br />
          <SplitText text="talk" by="char" className={styles.letter} startIndex={5} />
        </h2>

        <div
          ref={info}
          className={styles.info}
          data-info
          onFocus={() => {
            // A keyboard visitor reaching the links lands where they are fully shown
            if (motionEnabled && chapter.current && chapterProgress(chapter.current) < 0.8) scrollToProgress('contact', 0.85);
          }}
        >
          <div>
            <p className={styles.location}>{location}</p>
            <a className={styles.mail} href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </div>
          <ul className={styles.social}>
            {socialLinks.map(({ label, url }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.foot} data-foot>
          © {new Date().getFullYear()} Patrick Matayabas
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
