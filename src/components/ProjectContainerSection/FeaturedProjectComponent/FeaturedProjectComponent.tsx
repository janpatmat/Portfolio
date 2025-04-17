import React from 'react';
import styles from './FeaturedProjectComponent.module.scss';

interface FeaturedProjectProps {
  title: string;
  description: string;
  contributionTitle: string;
  contribution: string;
  functionTitle: string;
  functionDescription: string;
  imageAlt?: string;
  imageUrl?: string;
  url?: string;  // Make sure to include 'url' as optional here
}


const FeaturedProjectComponent: React.FC<FeaturedProjectProps> = ({
  title,
  description,
  contributionTitle,
  contribution,
  functionTitle,
  functionDescription,
  imageAlt,
  imageUrl,
  url
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.detailSection}>
        <h1>{title}</h1>
        <p>{description}</p>

        <h4>{contributionTitle}</h4>
        <p>{contribution}</p>

        <h4>{functionTitle}</h4>
        <p>{functionDescription}</p>
      </div>

      <div className={styles.picover}>
        <div className={styles.pictureSection}>
          {imageUrl ? <img src={imageUrl} alt={imageAlt || 'Project visual'} /> : <h1>Picture</h1>}
        </div>
      </div>

      {/* Conditionally render the button if 'url' is provided */}
      {url ? (
  // If URL exists, show the "Visit Project" button
  <div className={styles.buttonContainer}>
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button className={styles.projectButton}>Visit Project</button>
    </a>
  </div>
) : (
  // If URL doesn't exist, show a red button with "Website is no longer up"
  <div className={styles.buttonContainer}>
    <button className={`${styles.projectButton} ${styles.disabledButton}`}>
      Website is no longer up
    </button>
  </div>
)}

    </div>
  );
};

export default FeaturedProjectComponent;
