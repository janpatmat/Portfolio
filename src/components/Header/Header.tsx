
import styles from './Header.module.scss'
import { Roll } from 'react-awesome-reveal'
const Header = () => {
  return (
    <div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <Roll>
            <h1 className={styles.hakdog}>Hi I'm Patrick!</h1>
            </Roll>
            </div>
          <div className={styles.ctaContainer}>
           <a href="public\Matayabas-Resume-2025.pdf" download>
  <button className={styles.cta}>Download my CV</button>
</a>

          </div>
        </div>
        
    </div>
  )
}

export default Header