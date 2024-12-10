import React from 'react'
import styles from './FeaturedProjectComponent.module.scss'
const FeaturedProjectComponent = () => {
  return (
    <div className={styles.container}>
        <div className={styles.detailSection}>
            <h1>
                Header
            </h1>
            <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam repellat eum ea distinctio laudantium earum recusandae, aliquam iure explicabo id soluta tempora voluptas animi quisquam quasi accusamus quia a esse?
            </p>

            <h4>My contribution</h4>
            <p>I was a front end developer</p>
            
            <h4>Function</h4>
           <p>Function 1</p>
           <p>Function 2</p>
           <p>Function 3</p>
        </div>
        <div className={styles.pictureSection}>
            <h1>Picture</h1>
        </div>
    </div>
  )
}

export default FeaturedProjectComponent