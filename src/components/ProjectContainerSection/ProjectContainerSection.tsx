import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Project, projectCategories, projectImage, projectInitials, projects } from '../../data/projects';
import { gridSlots, GridSlot } from '../../hooks/motion/layout';
import { motionEnabled, scrollToProgress } from '../../hooks/motion/loop';
import { clamp, ease, lerp, rnd, seg } from '../../hooks/motion/math';
import { useChapter } from '../../hooks/motion/useChapter';
import { HOVER, PHONE, useMediaQuery } from '../../hooks/useMediaQuery';
import ProjectDetail from '../ProjectDetail/ProjectDetail';
import styles from './ProjectContainerSection.module.scss';

const ALL = 'All';
const filters = [ALL, ...projectCategories];

// Card and grid cell sizes, desktop and phone
const DESKTOP = { cellW: 228, cellH: 272, minCols: 2, maxCols: 5 };
const MOBILE = { cellW: 116, cellH: 148, minCols: 3, maxCols: 3 };

interface CardMotion {
  // where the card floats in 3D before the grid gathers
  sx: number;
  sy: number;
  sz: number;
  rx: number;
  ry: number;
  rz: number;
  // eased current grid slot, visibility and hover tilt
  gx: number;
  gy: number;
  gs: number;
  vis: number;
  tx: number;
  ty: number;
}

const ProjectContainerSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const titleEl = useRef<HTMLHeadingElement>(null);
  const filtersEl = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLButtonElement | null)[]>([]);
  const targets = useRef<(GridSlot & { vis: number })[]>([]);
  const pointer = useRef(projects.map(() => ({ x: 0, y: 0 })));
  const gathered = useRef(0);
  const [filter, setFilter] = useState(ALL);
  const [opened, setOpened] = useState<{ project: Project; opener: HTMLElement } | null>(null);
  const closeDetail = useCallback(() => setOpened(null), []);
  const phone = useMediaQuery(PHONE);
  const hover = useMediaQuery(HOVER);
  const shownCount = projects.filter((project) => filter === ALL || project.category === filter).length;

  const motion = useMemo<CardMotion[]>(() => {
    const spread = phone ? 0.5 : 1;
    return projects.map((_, i) => {
      const a = (i / projects.length) * Math.PI * 2 + rnd(i, 6) * 0.6;
      const r = (260 + rnd(i, 7) * 200) * spread;
      return {
        sx: Math.cos(a) * r * 1.5,
        sy: Math.sin(a) * r * 0.75,
        sz: -100 - rnd(i, 8) * 800,
        rx: rnd(i, 10) * 50 - 25,
        ry: rnd(i, 11) * 60 - 30,
        rz: rnd(i, 12) * 30 - 15,
        gx: 0,
        gy: 0,
        gs: 1,
        vis: 1,
        tx: 0,
        ty: 0,
      };
    });
  }, [phone]);

  // Grid targets for the cards that match the filter; the rest go back into the dark
  const layout = useCallback(() => {
    const shown = projects.map((project, i) => ({ i, match: filter === ALL || project.category === filter })).filter((c) => c.match);
    const slots = gridSlots(shown.length, {
      ...(phone ? MOBILE : DESKTOP),
      offsetY: 55,
      availW: window.innerWidth - 32,
      availH: window.innerHeight - 290,
    });
    const next = projects.map(() => ({ x: 0, y: 0, scale: slots[0]?.scale ?? 1, vis: 0 }));
    shown.forEach(({ i }, n) => (next[i] = { ...slots[n], vis: 1 }));
    targets.current = next;
  }, [filter, phone]);

  useEffect(() => {
    layout();
    window.addEventListener('resize', layout);
    return () => window.removeEventListener('resize', layout);
  }, [layout]);

  // Cards drift in 3D, then gather into the grid over the first 70% of the section
  useChapter(chapter, (p, time) => {
    const g = ease(seg(p, 0, 0.7));
    gathered.current = g;
    const h = window.innerHeight;
    if (titleEl.current) {
      titleEl.current.style.transform = `translate(-50%, -50%) translateY(${-g * (h / 2 - 92)}px) scale(${1 - g * 0.58})`;
    }
    if (filtersEl.current) {
      filtersEl.current.style.opacity = `${seg(p, 0.62, 0.75)}`;
      filtersEl.current.style.pointerEvents = p > 0.7 ? 'auto' : 'none';
    }
    motion.forEach((c, i) => {
      const el = cardEls.current[i];
      const target = targets.current[i];
      if (!el || !target) return;
      c.gx = lerp(c.gx, target.x, 0.1);
      c.gy = lerp(c.gy, target.y, 0.1);
      c.gs = lerp(c.gs, target.scale, 0.1);
      c.vis = lerp(c.vis, target.vis, 0.1);
      c.tx = lerp(c.tx, pointer.current[i].x, 0.12);
      c.ty = lerp(c.ty, pointer.current[i].y, 0.12);
      const a = g * c.vis;
      const idle = 1 - a;
      const fx = Math.sin(time / 1500 + i) * 14 * idle;
      const fy = Math.cos(time / 1800 + i * 1.3) * 12 * idle;
      const tilt = g > 0.95 && hover ? 1 : 0;
      el.style.transform =
        `translate(-50%, -50%) translate3d(${lerp(c.sx, c.gx, a) + fx}px, ${lerp(c.sy, c.gy, a) + fy}px, ${c.sz * idle}px) ` +
        `rotateX(${c.rx * idle - c.ty * 14 * tilt}deg) rotateY(${c.ry * idle + c.tx * 16 * tilt}deg) rotate(${c.rz * idle}deg) ` +
        `scale(${lerp(1, c.gs, a)})`;
      el.style.opacity = `${g > 0.5 ? 0.2 + 0.8 * clamp(c.vis, 0, 1) : 1}`;
      const reachable = target.vis === 1 && g > 0.95;
      el.style.pointerEvents = reachable ? 'auto' : 'none';
      el.tabIndex = reachable ? 0 : -1;
    });
  });

  // A keyboard visitor reaching the filters lands on the gathered grid
  const onFiltersFocus = () => {
    if (motionEnabled && gathered.current < 0.95) scrollToProgress('projects', 0.8);
  };

  const onPointerMove = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    const box = e.currentTarget.getBoundingClientRect();
    pointer.current[i] = { x: (e.clientX - box.left) / box.width - 0.5, y: (e.clientY - box.top) / box.height - 0.5 };
  };

  return (
    <section id="projects" ref={chapter} className={`chapter ${styles.projects}`}>
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">Selected Work</span>
        <span className="label label-r">Chapter 05</span>

        <h2 ref={titleEl} className={`serif ${styles.title}`}>
          Things I’ve built
        </h2>

        <div ref={filtersEl} className={styles.filters} role="group" aria-label="Filter projects" onFocus={onFiltersFocus}>
          {filters.map((name) => (
            <button key={name} type="button" aria-pressed={name === filter} onClick={() => setFilter(name)}>
              {name}
            </button>
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {shownCount} {shownCount === 1 ? 'project' : 'projects'} shown
        </p>

        <div className={styles.cards}>
          {projects.map((project, i) => {
            const image = projectImage(project);
            const matches = filter === ALL || project.category === filter;
            return (
              <button
                key={project.title}
                ref={(el) => (cardEls.current[i] = el)}
                type="button"
                className={styles.card}
                aria-label={`${project.title} (${project.category}): view details`}
                // With motion, the renderer makes a card reachable only once the grid has gathered
                tabIndex={motionEnabled ? -1 : 0}
                hidden={!motionEnabled && !matches}
                onClick={(e) => setOpened({ project, opener: e.currentTarget })}
                onMouseMove={(e) => onPointerMove(e, i)}
                onMouseLeave={() => (pointer.current[i] = { x: 0, y: 0 })}
                data-card
              >
                <span className={styles.media}>
                  {image ? (
                    <img src={image} alt="" width={204} height={128} loading="lazy" decoding="async" />
                  ) : (
                    <span className={`serif ${styles.placeholder}`}>{projectInitials(project)}</span>
                  )}
                </span>
                <span className={styles.body}>
                  <span className={styles.chip}>{project.category}</span>
                  <strong>{project.title}</strong>
                  <span className={styles.more}>View details →</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ProjectDetail project={opened?.project ?? null} opener={opened?.opener ?? null} onClose={closeDetail} />
    </section>
  );
};

export default ProjectContainerSection;
