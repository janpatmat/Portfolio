import React from 'react'
import styles from './ProjectPage.module.scss'
import Navbar from '../../components/Navbar/Navbar'
import ProjectsCardGrid from '../../components/ProjectsCardGrid/ProjectsCardGrid'
const ProjectPage = () => {
  return (
    <>
    <Navbar />

    <ProjectsCardGrid />

    </>
  )
}

export default ProjectPage