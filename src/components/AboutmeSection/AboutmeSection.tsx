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
                    <p className={styles.detailsParag}>Web Developer with <strong>5+ years</strong> of experience building fast websites and web apps. I've completed <strong>4+ professional projects</strong> using <strong>HTML, CSS, JavaScript, Laravel, Vue.js</strong>, and <strong>WordPress</strong>. Focused on clean code, performance, and user experience.</p>
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.detailsHeader}>
                    <h4 className={styles.dhead}>AI Integrated developer</h4>
                </div>
                <div className={styles.detailsContent}>
                    <p className={styles.detailsParag}> AI Integration Developer with <strong>3 years</strong> of experience leveraging AI tools to generate clean, efficient code. I’ve delivered <strong>2+ projects</strong> where AI accelerated development, boosted productivity, and reduced turnaround time. With a solid foundation in web development, I can fully understand, customize, and adapt AI-generated code to fit any project needs—bridging the gap between automation and real-world application.
</p>
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.detailsHeader}>
                    <h4 className={styles.dhead}>DevOps Engineer</h4>
                </div>
                <div className={styles.detailsContent}>
                    <p className={styles.detailsParag}>An aspiring DevOps Engineer with <strong>1 year</strong> of hands-on experience, including <strong>2 side projects</strong> and <strong>1 professional role</strong> focused on CI/CD, automation, and cloud infrastructure. In my projects, I improved deployment speed by <strong>60%</strong> and reduced downtime by <strong>40%</strong> through streamlined pipelines and proactive monitoring. I'm passionate about efficiency, scalability, and delivering smooth development-to-production workflows.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AboutmeSection