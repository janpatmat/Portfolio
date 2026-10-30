import React from 'react';
import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
  label: string;
  children: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label, children }) => {
  return (
    <div className={styles.heading}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{children}</h2>
    </div>
  );
};

export default SectionHeading;
