import { CSSProperties, useRef } from 'react';
import { clamp } from '../../hooks/motion/math';
import { useChapter } from '../../hooks/motion/useChapter';
import styles from './ServicesSection.module.scss';

const services = [
  {
    title: 'Web Developer',
    description:
      '3+ years building fast, reliable web apps that are easy to maintain and extend, from enterprise outage monitoring to point-of-sale systems.',
    stat: '3+',
    statCaption: 'years building web apps',
  },
  {
    title: 'AI Integrated developer',
    description:
      'Faster feature delivery with agentic AI development using Claude, while keeping code secure and maintainable. I also build AI products, including a RAG assistant.',
    stat: 'RAG',
    statCaption: 'AI assistant I built',
  },
  {
    title: 'DevOps Engineer',
    description:
      'Streamlined pipelines improved deployment speed by 60% and cut downtime by 40% in my projects. I also run secure production infrastructure on AWS.',
    stat: '60%',
    statCaption: 'faster deployments',
  },
];

const ServicesSection = () => {
  const chapter = useRef<HTMLElement>(null);
  const panelEls = useRef<(HTMLElement | null)[]>([]);

  // Each panel slides up over the last, which shrinks, tilts back and dims
  useChapter(chapter, (p) => {
    const P = p * (services.length - 1);
    panelEls.current.forEach((el, i) => {
      if (!el) return;
      const t = P - i;
      let y = 0;
      let scale = 1;
      let tilt = 0;
      let brightness = 1;
      if (t < 0) {
        y = clamp(-t, 0, 1) * window.innerHeight;
      } else {
        const depth = clamp(t, 0, 3);
        scale = 1 - depth * 0.06;
        tilt = clamp(t, 0, 1) * 9;
        brightness = 1 - depth * 0.3;
        y = -depth * 18;
      }
      el.style.transform = `translate(-50%, -50%) translateY(${y}px) scale(${scale}) rotateX(${tilt}deg)`;
      el.style.filter = `brightness(${brightness})`;
    });
  });

  return (
    <section
      id="services"
      ref={chapter}
      className={`chapter ${styles.services}`}
      style={{ '--rows': services.length } as CSSProperties}
    >
      <div className={`stage ${styles.stage}`}>
        <span className="label label-l">Services</span>
        <span className="label label-r">Chapter 03</span>

        <h2 className={`serif ${styles.title}`}>What I bring</h2>

        <div className={styles.panels}>
          {services.map((service, i) => (
            <article
              key={service.title}
              ref={(el) => (panelEls.current[i] = el)}
              className={`on-paper ${styles.panel}`}
              style={{ zIndex: i + 1 }}
              data-service
            >
              <div className={styles.left}>
                <span className={styles.count}>
                  {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                </span>
                <h3 className="serif">{service.title}</h3>
              </div>
              <div className={styles.right}>
                <p>{service.description}</p>
                <div className={`serif ${styles.stat}`}>
                  {service.stat}
                  <small>{service.statCaption}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
