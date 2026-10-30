import { FaArrowRight, FaCloud, FaGraduationCap, FaLaptopCode, FaRobot } from 'react-icons/fa';
import { cvUrl } from '../../data/links';
import SectionHeading from '../SectionHeading/SectionHeading';
import styles from './AboutmeSection.module.scss'

const highlights = [
  {
    title: 'Full-Stack Apps',
    text: 'Web and mobile apps with Next.js, Flutter, and FastAPI, including enterprise outage monitoring.',
    Icon: FaLaptopCode,
    href: '#experience',
    linkLabel: 'See my experience',
  },
  {
    title: 'AI Products',
    text: 'RAG, LLM integration, and agentic AI with Claude, built into real products.',
    Icon: FaRobot,
    href: '#projects',
    linkLabel: 'See my projects',
  },
  {
    title: 'APIs and Cloud',
    text: 'Secure, scalable APIs running on AWS infrastructure.',
    Icon: FaCloud,
    href: '#skills',
    linkLabel: 'See my skills',
  },
  {
    title: 'Education',
    text: 'BS in Information Technology from Ateneo de Davao University, June 2025.',
    Icon: FaGraduationCap,
    href: cvUrl,
    linkLabel: 'Open my CV',
  },
];

const AboutmeSection = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading label="About Me">
          3+ Years Building <span className="accent">Reliable Software</span>
        </SectionHeading>

        <div className={styles.grid}>
          {highlights.map(({ title, text, Icon, href, linkLabel }) => (
            <article key={title} className={styles.card}>
              <span className={styles.iconWrap}>
                <Icon className={styles.icon} aria-hidden="true" />
              </span>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.text}>{text}</p>
              <a
                href={href}
                className={styles.link}
                aria-label={linkLabel}
                {...(href === cvUrl && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <FaArrowRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutmeSection
