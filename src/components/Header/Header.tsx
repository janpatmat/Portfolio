import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { location } from '../../data/links';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';
import { clamp, ease, lerp, rnd, seg } from '../../hooks/motion/math';
import { motionEnabled } from '../../hooks/motion/loop';
import { useChapter } from '../../hooks/motion/useChapter';
import { HOVER, PHONE, useMediaQuery } from '../../hooks/useMediaQuery';
import SplitText from '../SplitText/SplitText';
import styles from './Header.module.scss'

const stats = [
  { value: '3+', label: 'Years of experience' },
  { value: '5', label: 'Professional roles' },
  { value: `${projects.length}`, label: 'Projects built' },
];

const heroTools = [
  'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'Flutter', 'AWS', 'Docker',
  'Agentic AI (Claude)', 'PostgreSQL', 'Laravel', 'Vue.js', 'Node.js', 'RAG', 'NGINX', 'Linux',
];
const tools = heroTools.flatMap((name) => skills.filter((skill) => skill.name === name));

const letterDelay = (i: number) => ({ transitionDelay: `${200 + i * 45}ms` });

const Header = () => {
  const chapter = useRef<HTMLElement>(null);
  const tileLayer = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const statsRow = useRef<HTMLDListElement>(null);
  const tileEls = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const [loaded, setLoaded] = useState(false);
  const phone = useMediaQuery(PHONE);
  const hover = useMediaQuery(HOVER);

  const shown = useMemo(() => (phone ? tools.slice(0, 10) : tools), [phone]);

  // Resting spots in 3D around the headline, spread in a wide ellipse
  const spots = useMemo(() => {
    const spread = phone ? 0.5 : 1;
    return shown.map((_, i) => {
      const a = (i / shown.length) * Math.PI * 2 + rnd(i, 1) * 0.5;
      const r = (330 + rnd(i, 2) * 260) * spread;
      return { x: Math.cos(a) * r * 1.45, y: Math.sin(a) * r * 0.72, z: -150 - rnd(i, 3) * 950, rot: rnd(i, 4) * 30 - 15 };
    });
  }, [shown, phone]);

  // Tiles fly toward and past the viewer as the hero scrolls away
  const placeTiles = (p: number, time: number, drift: boolean) => {
    spots.forEach((o, i) => {
      const el = tileEls.current[i];
      if (!el) return;
      const z = o.z + ease(p) * 1700;
      const fx = drift ? Math.sin(time / 1800 + i) * 12 : 0;
      const fy = drift ? Math.cos(time / 2100 + i * 1.7) * 12 : 0;
      el.style.visibility = z > 880 ? 'hidden' : 'visible';
      el.style.transform = `translate(-50%, -50%) translate3d(${o.x + fx}px, ${o.y + fy}px, ${z}px) rotate(${o.rot}deg)`;
      el.style.opacity = `${clamp(1 - (z - 350) / 450, 0, 1)}`;
    });
  };

  useChapter(chapter, (p, time) => {
    const m = mouse.current;
    m.cx = lerp(m.cx, m.x, 0.06);
    m.cy = lerp(m.cy, m.y, 0.06);
    if (tileLayer.current) {
      tileLayer.current.style.transform = `rotateY(${m.cx * 18}deg) rotateX(${-m.cy * 12}deg)`;
    }
    placeTiles(p, time, true);
    if (copy.current) {
      copy.current.style.transform = `scale(${1 + ease(p) * 0.6})`;
      copy.current.style.opacity = `${1 - seg(p, 0.2, 0.7)}`;
    }
    if (statsRow.current) statsRow.current.style.opacity = `${1 - seg(p, 0, 0.25)}`;
  });

  // Without motion the tiles still need placing once, at rest
  useLayoutEffect(() => {
    if (!motionEnabled) placeTiles(0, 0, false);
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!motionEnabled || !hover) return;
    const m = mouse.current;
    const onMove = (e: MouseEvent) => {
      m.x = e.clientX / window.innerWidth - 0.5;
      m.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      m.x = 0;
      m.y = 0;
    };
  }, [hover]);

  return (
    <section id="home" ref={chapter} className={`chapter ${styles.hero} ${loaded ? styles.loaded : ''}`}>
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">Patrick Matayabas</span>
        <span className="label label-r">{location}</span>

        <div ref={tileLayer} className={styles.tiles} aria-hidden="true" translate="no">
          {shown.map((tool, i) => (
            <div key={tool.name} ref={(el) => (tileEls.current[i] = el)} className={styles.tile} data-tile>
              <i style={{ background: tool.color }} />
              {tool.name}
            </div>
          ))}
        </div>

        <div ref={copy} className={styles.copy} data-hero-copy>
          <p className={styles.hello}>Hi, I’m Patrick</p>
          <h1 className={`serif ${styles.title}`}>
            <span className="visually-hidden">Software Engineer</span>
            <span className={styles.line}>
              <SplitText text="Software" by="char" className={styles.ch} pieceStyle={letterDelay} />
            </span>
            <span className={styles.line}>
              <SplitText text="Engineer" by="char" className={styles.ch} startIndex={8} pieceStyle={letterDelay} />
            </span>
          </h1>
          <p className={styles.sub}>
            for web, mobile, and <em>AI</em>
          </p>
        </div>

        <dl ref={statsRow} className={styles.stats} data-stats>
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd className="serif">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Header
