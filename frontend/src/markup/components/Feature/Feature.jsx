import React from 'react';
import carRef from "../../../assets/images/EngineTacho.jpg";

const Feature = () => {
  return (
    <section className="features-section">
    <div className="auto-container">
      <div className="row">
        <div className="col-lg-6">
          <div className="inner-container">
            <h2>Quality Service And <br /> Customer Satisfaction !!</h2>
            <div className="text">
            At Abe Garage, quality service and customer satisfaction are at the heart of everything we do. We believe that every vehicle deserves the highest level of care, which is why our experienced technicians go above and beyond to ensure that each service meets our rigorous standards. From the moment you walk through our doors, you'll experience our commitment to excellence, whether it's through our precise diagnostics, meticulous repairs, or the friendly, transparent communication we maintain throughout the process. Your satisfaction is our top priority, and we take pride in delivering reliable, efficient service that not only meets but exceeds your expectations. Trust Abe Garage to provide the quality care your vehicle deserves, with a focus on keeping you safe and satisfied every step of the way.
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="image"><img src={carRef} alt="engine tachometer" /></div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Feature