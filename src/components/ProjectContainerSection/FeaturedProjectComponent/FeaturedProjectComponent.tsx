import React from 'react';
import { FaArrowRight, FaCode } from 'react-icons/fa';
import styles from './FeaturedProjectComponent.module.scss';

interface FeaturedProjectProps {
  title: string;
  category: string;
  description: string;
  contribution: string;
  imageAlt?: string;
  imageUrl?: string;
  url?: string;
  offline?: boolean;
}


const FeaturedProjectComponent: React.FC<FeaturedProjectProps> = ({
  title,
  category,
  description,
  contribution,
  imageAlt,
  imageUrl,
  url,
  offline
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.picture}>
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt || 'Project visual'} loading="lazy" />
        ) : (
          <FaCode className={styles.pictureIcon} aria-hidden="true" />
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <p className={styles.description}>{contribution}</p>

        {url && (
          <a className={styles.link} href={url} target="_blank" rel="noopener noreferrer">
            Visit Project <FaArrowRight aria-hidden="true" />
          </a>
        )}
        {offline && <span className={styles.offline}>Website is no longer up</span>}
      </div>
    </article>
  );
};

export default FeaturedProjectComponent;
