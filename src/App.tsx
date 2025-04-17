import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import ProjectSectionHeader from './components/ProjectSectionHeader/ProjectSectionHeader'
import ProjectContainerSection from './components/ProjectContainerSection/ProjectContainerSection'
import AboutmeSection from './components/AboutmeSection/AboutmeSection'
import './globals/global.scss'
import './app.css'
function App() {
 

  return (
    <div className='canvas'>
      {/* <div className='navbar'>
        <Navbar />
      </div> */}
  
      <div className='header'>
        <Header />
      </div>
      
      <ProjectSectionHeader />
      {/* <div className="second">
        <h2>Hello im patrick</h2>
      </div> */}
      <ProjectContainerSection />
      <AboutmeSection />
    </div>
  )
  
}

export default App
