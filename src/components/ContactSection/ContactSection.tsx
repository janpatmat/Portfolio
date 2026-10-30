import { FaDownload, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { contactEmail, cvUrl, location, socialLinks } from '../../data/links';
import styles from './ContactSection.module.scss';

const ContactSection = () => {
  return (
    <section id="contact" className="section">
      <div className={`container ${styles.grid}`}>
        <div>
          <span className={styles.label}>Contact me</span>
          <h2 className={styles.title}>
            Let's Talk About your <span className="accent">Next Project</span>
          </h2>
          <p className={styles.text}>
            Email me, message me on any of these profiles, or download my CV for the full picture.
          </p>

          <ul className={styles.details}>
            <li>
              <span className={styles.detailIcon} aria-hidden="true"><FaMapMarkerAlt /></span>
              <div>
                <span className={styles.detailLabel}>Location:</span>
                {location}
              </div>
            </li>
            <li>
              <span className={styles.detailIcon} aria-hidden="true"><FaEnvelope /></span>
              <div>
                <span className={styles.detailLabel}>Email:</span>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <div className={styles.links}>
            {socialLinks.map(({ label, handle, url, Icon }) => (
              <div key={label} className={styles.field}>
                <span className={styles.fieldLabel}>{label}</span>
                <a className={styles.fieldBox} href={url} target="_blank" rel="noopener noreferrer">
                  {handle}
                  <Icon aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>

          <a href={cvUrl} className={`button ${styles.cta}`} download>
            Download my CV <FaDownload aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
