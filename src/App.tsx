// Loaded first so component modules can override the shared classes
import './globals/global.scss'
import SiteNav from './components/SiteNav/SiteNav'
import Header from './components/Header/Header'
import AboutmeSection from './components/AboutmeSection/AboutmeSection'
import ExperienceSection from './components/ExperienceSection/ExperienceSection'
import ServicesSection from './components/ServicesSection/ServicesSection'
import SkillsSection from './components/SkillsSection/SkillsSection'
import ProjectContainerSection from './components/ProjectContainerSection/ProjectContainerSection'
import ContactSection from './components/ContactSection/ContactSection'
import { useEffect } from 'react'
import { scrollToHash, startMotion } from './hooks/motion/loop'

function App() {
  useEffect(() => {
    const stopMotion = startMotion()
    scrollToHash()
    return stopMotion
  }, [])

  return (
    <>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <Header />
        <AboutmeSection />
        <ExperienceSection />
        <ServicesSection />
        <SkillsSection />
        <ProjectContainerSection />
        <ContactSection />
      </main>
    </>
  )
}

export default App
