import { useState } from 'react';
import styles from './ProjectContainerSection.module.scss';
import FeaturedProjectComponent from './FeaturedProjectComponent/FeaturedProjectComponent';
import SectionHeading from '../SectionHeading/SectionHeading';
import projectData from '../../data/projectData.json';

const ALL = 'Show All';
const filters = [ALL, ...new Set(projectData.map((project) => project.category))];

const ProjectContainerSection = () => {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const visibleProjects = projectData.filter(
    (project) => activeFilter === ALL || project.category === activeFilter
  );

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading label="Latest Works">
          Projects I've <span className="accent">Worked On</span>
        </SectionHeading>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.filter} ${filter === activeFilter ? styles.filterActive : ''}`}
              aria-pressed={filter === activeFilter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visibleProjects.map((project) => {
            // Resolve image path dynamically based on the project imageUrl
            const imageSrc = project.imageUrl
              ? new URL(`../../assets/${project.imageUrl}`, import.meta.url).href
              : undefined;

            return (
              <FeaturedProjectComponent
                key={project.title}
                title={project.title}
                category={project.category}
                description={project.description}
                contribution={project.contribution}
                imageAlt={project.imageAlt}
                imageUrl={imageSrc}
                url={project.url}
                offline={project.offline}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectContainerSection;
