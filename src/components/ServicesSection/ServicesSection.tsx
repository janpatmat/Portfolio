import { FaCode, FaRobot, FaServer } from 'react-icons/fa';
import SectionHeading from '../SectionHeading/SectionHeading';
import styles from './ServicesSection.module.scss';

const ServicesSection = () => {
  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeading label="Services">
          What I Bring to Your <span className="accent">Project</span>
        </SectionHeading>

        <div className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.icon} aria-hidden="true"><FaCode /></span>
            <h3 className={styles.title}>Web Developer</h3>
            <p><strong>3+ years</strong> building fast, reliable web apps that are easy to maintain and extend, from enterprise outage monitoring to point-of-sale systems.</p>
          </article>

          <article className={styles.card}>
            <span className={styles.icon} aria-hidden="true"><FaRobot /></span>
            <h3 className={styles.title}>AI Integrated developer</h3>
            <p>Faster feature delivery with agentic AI development using <strong>Claude</strong>, while keeping code secure and maintainable. I also build AI products, including a <strong>RAG</strong> assistant.</p>
          </article>

          <article className={styles.card}>
            <span className={styles.icon} aria-hidden="true"><FaServer /></span>
            <h3 className={styles.title}>DevOps Engineer</h3>
            <p>Streamlined pipelines improved deployment speed by <strong>60%</strong> and cut downtime by <strong>40%</strong> in my projects. I also run secure production infrastructure on <strong>AWS</strong>.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
