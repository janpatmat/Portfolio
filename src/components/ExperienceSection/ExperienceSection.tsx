import { CSSProperties, useEffect, useRef } from 'react';
import experienceData from '../../data/experienceData.json';
import { experienceRows } from '../../hooks/motion/layout';
import { useChapter } from '../../hooks/motion/useChapter';
import { PHONE, useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './ExperienceSection.module.scss';

const ExperienceSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const rowEls = useRef<(HTMLLIElement | null)[]>([]);
  const numEls = useRef<(HTMLSpanElement | null)[]>([]);
  // Unscaled row sizes, kept current by a ResizeObserver (resizes, font swaps)
  const size = useRef({ heights: [] as number[], width: 1 });
  const phone = useMediaQuery(PHONE);

  useEffect(() => {
    const measure = () => {
      const rows = rowEls.current.filter((el): el is HTMLLIElement => !!el);
      size.current = { heights: rows.map((el) => el.offsetHeight), width: rows[0]?.offsetWidth || 1 };
    };
    measure();
    const observer = new ResizeObserver(measure);
    rowEls.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useChapter(chapter, (p) => {
    const { heights, width } = size.current;
    const placements = experienceRows(p * (heights.length - 1), heights, {
      top: phone ? 170 : 210,
      gap: phone ? 28 : 36,
      step: phone ? 16 : 64,
      width,
    });
    placements.forEach((row, i) => {
      const el = rowEls.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${row.x}px, ${row.y}px, 0) scale(${row.scale})`;
      el.style.opacity = `${row.opacity}`;
      const num = numEls.current[i];
      if (num) num.style.transform = `scale(${row.numScale})`;
    });
  });

  return (
    <section
      id="experience"
      ref={chapter}
      className={`chapter on-paper ${styles.experience}`}
      style={{ '--rows': experienceData.length } as CSSProperties}
    >
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">My Experience</span>
        <span className="label label-r">Chapter 02</span>

        <div className={styles.head}>
          <h2 className="serif">Where I’ve worked</h2>
        </div>

        <ol className={styles.list}>
          {experienceData.map((job, i) => (
            <li key={`${job.company} ${job.date}`} ref={(el) => (rowEls.current[i] = el)} className={styles.row} data-row>
              <div className={styles.role}>
                <span className={styles.date}>{job.date}</span>
                <h3>{job.title}</h3>
                <span>{job.company}</span>
              </div>
              <span ref={(el) => (numEls.current[i] = el)} className={`serif ${styles.num}`} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <ul className={styles.details}>
                {job.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSection;
