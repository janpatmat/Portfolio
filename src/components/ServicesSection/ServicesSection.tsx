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
            <p>Web Developer with <strong>3+ years</strong> of experience building fast websites and web apps. I've completed <strong>4+ professional projects</strong> using <strong>HTML, CSS, JavaScript, Laravel, Vue.js</strong>, and <strong>WordPress</strong>. Focused on clean code, performance, and user experience. Recent work includes enterprise outage-monitoring applications, a point-of-sale system built with <strong>Next.js</strong> and <strong>PostgreSQL</strong>, and client websites on <strong>WordPress</strong> and <strong>Elementor</strong>.</p>
          </article>

          <article className={styles.card}>
            <span className={styles.icon} aria-hidden="true"><FaRobot /></span>
            <h3 className={styles.title}>AI Integrated developer</h3>
            <p>AI Integration Developer with <strong>3 years</strong> of experience leveraging AI tools to generate clean, efficient code. I’ve delivered <strong>2+ projects</strong> where AI accelerated development, boosted productivity, and reduced turnaround time. With a solid foundation in web development, I can fully understand, customize, and adapt AI-generated code to fit any project needs—bridging the gap between automation and real-world application. Recent work includes a <strong>RAG</strong>-powered consultant-matching assistant, an AI calendar app built with <strong>Flutter</strong> and <strong>FastAPI</strong>, and agentic AI development with <strong>Claude</strong>.</p>
          </article>

          <article className={styles.card}>
            <span className={styles.icon} aria-hidden="true"><FaServer /></span>
            <h3 className={styles.title}>DevOps Engineer</h3>
            <p>An aspiring DevOps Engineer with <strong>1 year</strong> of hands-on experience, including <strong>2 side projects</strong> and <strong>1 professional role</strong> focused on CI/CD, automation, and cloud infrastructure. In my projects, I improved deployment speed by <strong>60%</strong> and reduced downtime by <strong>40%</strong> through streamlined pipelines and proactive monitoring. I'm passionate about efficiency, scalability, and delivering smooth development-to-production workflows. I also build and maintain production infrastructure on <strong>AWS (EC2, S3, Amplify)</strong>, deploy with <strong>Docker</strong> and <strong>NGINX</strong>, and secure API endpoints.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
