import styles from './Header.module.scss'
import { Roll, Fade} from 'react-awesome-reveal'
import { FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

const Header = () => {
  return (
    <div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <Roll>
              <h1 className={styles.hakdog}>Hi I'm Patrick!</h1>
              
            </Roll>
            <div className={styles.parContainer}>
              <Fade cascade delay={1000}>
              <p>I'm a seasoned web developer with expertise in React, Next.js, Vue.js, Node.js, Laravel,</p>
              <p> and DevOps practices like CI/CD, Docker, Jenkins, Python, Linux, and AWS.</p>
           
              </Fade>
           
            </div>
            
            <div className={styles.iconRow}>
            <Fade delay={2000} cascade>
          <a href="https://www.linkedin.com/in/jan-patrick-matayabas-a75a31245/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className={styles.icon} />
          </a>
        
         
          <a href="https://github.com/janpatmat" target="_blank" rel="noopener noreferrer">
            <FaGithub className={styles.icon} />
          </a>
          
          
          <a href="https://www.facebook.com/janpatrick.matayabas" target="_blank" rel="noopener noreferrer">
            <FaFacebook className={styles.icon} />
          </a>
          </Fade>
        </div>
        
          </div>
          <Fade delay={3100}>
          <div className={styles.ctaContainer}>
            <a href="public\Matayabas-Resume-2025.pdf" download>
              <button className={styles.cta}>Download my CV</button>
            </a>
          </div>
          </Fade>
        </div>
    </div>
  )
}

export default Header
