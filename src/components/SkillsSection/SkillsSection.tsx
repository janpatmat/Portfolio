import { useRef } from 'react';
import { skillGroups, skills } from '../../data/skills';
import { bounce, rnd, seg } from '../../hooks/motion/math';
import { useChapter } from '../../hooks/motion/useChapter';
import styles from './SkillsSection.module.scss';

const groups = skillGroups.map((group) => ({ group, items: skills.filter((skill) => skill.group === group) }));
const tileCount = groups.reduce((n, g) => n + g.items.length, 0);

// Tiles drop in a shuffled but stable order
const dropOrder = Array.from({ length: tileCount }, (_, i) => i).sort((a, b) => rnd(a, 9) - rnd(b, 9));

const SkillsSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const tileEls = useRef<(HTMLDivElement | null)[]>([]);

  // Each tile falls from above the screen, lands at the bottom of its column and bounces
  useChapter(chapter, (p) => {
    dropOrder.forEach((tile, k) => {
      const el = tileEls.current[tile];
      if (!el) return;
      const a = (k / tileCount) * 0.6;
      const q = seg(p, a, a + 0.22);
      const fall = (1 - bounce(q)) * window.innerHeight;
      el.style.transform = `translateY(${-fall}px) rotate(${(1 - q) * (rnd(tile, 5) * 60 - 30)}deg)`;
    });
  });

  let index = 0;

  return (
    <section id="skills" ref={chapter} className={`chapter ${styles.skills}`}>
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">Skills</span>
        <span className="label label-r">Chapter 04</span>

        <h2 className={`serif ${styles.title}`}>
          The tools
          <br />I work with
        </h2>

        <div className={styles.groups}>
          {groups.map(({ group, items }) => (
            <div key={group} className={styles.group} data-group>
              <h3>{group}</h3>
              <div className={styles.tiles} translate="no">
                {items.map((skill) => {
                  const i = index++;
                  return (
                    <div key={skill.name} ref={(el) => (tileEls.current[i] = el)} className={styles.tile} data-skill>
                      <i style={{ background: skill.color }} />
                      {skill.name}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
