import { FaArrowRight } from 'react-icons/fa';
import SectionHeading from '../SectionHeading/SectionHeading';
import experienceData from '../../data/experienceData.json';
import styles from './ExperienceSection.module.scss';

const ExperienceSection = () => {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading label="My Experience">
          Where I've <span className="accent">Worked</span>
        </SectionHeading>

        <div className={styles.panel}>
          <ul className={styles.list}>
            {experienceData.map((job) => (
              <li key={`${job.company} ${job.date}`} className={styles.item}>
                <span className={styles.marker} aria-hidden="true">
                  <FaArrowRight />
                </span>
                <div>
                  <span className={styles.date}>{job.date}</span>
                  <h3 className={styles.title}>{job.title}</h3>
                  <span className={styles.company}>{job.company}</span>
                  <ul className={styles.details}>
                    {job.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
