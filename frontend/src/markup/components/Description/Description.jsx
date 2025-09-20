import React from 'react'

import EthGirl from "../../../assets/images/Mechanicgirl.png"
function Description() {
  return (
    <div> <section class="about-section-three">
    <div class="auto-container">
        <div class="row">
            <div class="col-lg-7">
                <div class="content">
                    <h2>We are highly skilled mechanics <br/> for your car repair</h2>
                    <div class="text">
                        <p>At Abe Garage, we are committed to providing exceptional automotive care, backed by over 24 years of industry experience. Our state-of-the-art facility and team of certified expert mechanics are equipped to handle everything from routine maintenance to complex repairs, ensuring that your vehicle remains in top condition. We pride ourselves on delivering fast, high-quality service at the best prices in town, making us the go-to choice for drivers who value both performance and reliability.</p>
                        <p>Whether it's a simple oil change, a detailed diagnostic, or a major repair, Abe Garage is dedicated to meeting and exceeding your expectations. Our award-winning workshop is a testament to our commitment to quality and customer satisfaction. Trust us to keep your vehicle running smoothly, safely, and efficiently—every time you visit.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="image"><img src={EthGirl} alt=""/></div>
            </div>
        </div>
    </div>
</section></div>
  )
}

export default Description