import React from 'react';
import styles from './ProjectContainerSection.module.scss';
import FeaturedProjectComponent from './FeaturedProjectComponent/FeaturedProjectComponent';
import projectData from '../../data/projectData.json';

const ProjectContainerSection = () => {
  return (
    <div className={styles.container}>
      {projectData.map((project, index) => {
        // Resolve image path dynamically based on the project imageUrl
        const imageSrc = new URL(`../../assets/${project.imageUrl}`, import.meta.url).href;

        return (
          <FeaturedProjectComponent
            key={index}
            title={project.title}
            description={project.description}
            contributionTitle={project.contributionTitle}
            contribution={project.contribution}
            functionTitle={project.functionTitle}
            functionDescription={project.functionDescription}
            imageAlt={project.imageAlt}
            imageUrl={imageSrc}
            url={project.url} // Pass the optional URL here
          />
        );
      })}
    </div>
  );
};

export default ProjectContainerSection;
