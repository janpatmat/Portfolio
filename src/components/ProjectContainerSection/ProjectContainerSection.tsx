import React from 'react'
import styles from './ProjectContainerSection.module.scss'
import FeaturedProjectComponent from './FeaturedProjectComponent/FeaturedProjectComponent'
const ProjectContainerSection = () => {
  return (
    <div className={styles.container}>
        
        <FeaturedProjectComponent />
    </div>
  )
}

export default ProjectContainerSection