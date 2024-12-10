import React from 'react'
import styles from './AboutmeSection.module.scss'
const AboutmeSection = () => {
  return (
    <div className={styles.container}>
        <div className={styles.innerContainer}>
            <h1 className={styles.header}>Get to know a little bit more about me</h1>
        </div>

        <div className={styles.secondSection}>
            <div className={styles.details}>
                <div className={styles.detailsHeader}>
                    <h4 className={styles.dhead}>Web Developer</h4>
                </div>
                <div className={styles.detailsContent}>
                    <p className={styles.detailsParag}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequuntur eligendi corrupti debitis consectetur, enim perferendis accusantium dolorum harum numquam! Necessitatibus nobis placeat eius totam nostrum temporibus repudiandae earum ad?</p>
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.detailsHeader}>
                    <h4 className={styles.dhead}>Developer</h4>
                </div>
                <div className={styles.detailsContent}>
                    <p className={styles.detailsParag}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequuntur eligendi corrupti debitis consectetur, enim perferendis accusantium dolorum harum numquam! Necessitatibus nobis placeat eius totam nostrum temporibus repudiandae earum ad?</p>
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.detailsHeader}>
                    <h4 className={styles.dhead}>Developer</h4>
                </div>
                <div className={styles.detailsContent}>
                    <p className={styles.detailsParag}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequuntur eligendi corrupti debitis consectetur, enim perferendis accusantium dolorum harum numquam! Necessitatibus nobis placeat eius totam nostrum temporibus repudiandae earum ad?</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AboutmeSection