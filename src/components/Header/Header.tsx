import { FaDownload } from 'react-icons/fa';
import { cvUrl } from '../../data/links';
import projectData from '../../data/projectData.json';
import styles from './Header.module.scss'

const stats = [
  { value: '3+', label: 'Years of experience' },
  { value: '5', label: 'Professional roles' },
  { value: `${projectData.length}`, label: 'Projects built' },
];

const Header = () => {
  return (
    <section id="home" className={styles.hero}>
      <span className={`${styles.shape} ${styles.shapeLeft}`} aria-hidden="true" />
      <span className={`${styles.shape} ${styles.shapeRight}`} aria-hidden="true" />

      <div className={`container ${styles.intro}`}>
        <p className={styles.greeting}>Hi! 👋 My name is Patrick</p>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>Software Engineer</span> for Web, Mobile, and <span className="accent">AI</span>
        </h1>
        <div className={styles.cta}>
          <a href={cvUrl} className="button" download>
            Download my CV <FaDownload aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="container">
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Header
