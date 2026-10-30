// Loaded first so component modules can override the shared classes
import './globals/global.scss'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import AboutmeSection from './components/AboutmeSection/AboutmeSection'
import ExperienceSection from './components/ExperienceSection/ExperienceSection'
import ServicesSection from './components/ServicesSection/ServicesSection'
import SkillsSection from './components/SkillsSection/SkillsSection'
import ProjectContainerSection from './components/ProjectContainerSection/ProjectContainerSection'
import ContactSection from './components/ContactSection/ContactSection'
import Footer from './components/Footer/Footer'
import ScrollTopButton from './components/ScrollTopButton/ScrollTopButton'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Header />
        <AboutmeSection />
        <ExperienceSection />
        <ServicesSection />
        <SkillsSection />
        <ProjectContainerSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollTopButton />
    </>
  )
}

export default App
