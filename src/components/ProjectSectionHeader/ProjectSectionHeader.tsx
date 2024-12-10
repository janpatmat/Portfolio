import React from 'react'
import styles from './ProjectSectionHeader.module.scss'
import { Fade } from 'react-awesome-reveal'
const ProjectSectionHeader = () => {
  return (
    <div className={styles.container}>
        <Fade triggerOnce delay={200} fraction={1/2}>
        <h1 className={styles.header}>PROJECTS</h1> 
        </Fade>
    </div>
  )
}

export default ProjectSectionHeader