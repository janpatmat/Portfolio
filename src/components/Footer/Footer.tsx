import { socialLinks } from '../../data/links';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={`container ${styles.footer}`}>
      <p className={styles.copyright}>
        Copyright @{new Date().getFullYear()}, <span className="accent">Patrick Matayabas</span> All Rights Reserved.
      </p>
      <div className={styles.links}>
        {socialLinks.map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
