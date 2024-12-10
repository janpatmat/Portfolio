import React from 'react'
import styles from './Header.module.scss'
import { Roll, Fade } from 'react-awesome-reveal'
const Header = () => {
  return (
    <div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <Roll>
            <h1 className={styles.hakdog}>Lets turn your THOUGHTS into RESULTS</h1>
            </Roll>
            </div>
          <div className={styles.ctaContainer}>
           <button className={styles.cta}>Contact me</button>
          </div>
        </div>
        
    </div>
  )
}

export default Header