import React from 'react'
import vban1 from "../../../assets/images/EngineTacho.jpg";
import vban2 from "../../../assets/images/Oil.jpg";
const About = () => {
 return (
    <section className="about-section">
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-5">
            <div className="image-box">
              <img src={vban1} alt="engine oil" />
              <img src={vban2} alt="engine parts" />
              <div className="year-experience" data-parallax='{"y": 30}'>
                <strong>24</strong> years <br />
                Experience{" "}
              </div>
            </div>
          </div>
          <div className="col-lg-7 pl-lg-5">
            <div className="sec-title">
              <h5>Welcome to our workshop</h5>
              <h2>We have 24 years experience</h2>
              <div className="text">
                <p>
                At Abe Garage, we pride ourselves on offering a comprehensive range of automotive services designed to keep your vehicle running smoothly and safely. From routine auto repair and maintenance to more complex transmission repair and replacement, our experienced technicians are equipped to handle all your vehicle's needs. We understand the importance of keeping your car in peak condition, which is why we offer state emissions inspections, tire repair and replacement, brake services, and wheel alignments. Our commitment to quality and safety ensures that every service we provide meets the highest standards, giving you peace of mind on the road.
                </p>
                <p>
                Our expertise extends beyond standard repair services. We specialize in electrical diagnostics, fuel system repairs, and starting and charging repairs, ensuring that every aspect of your vehicle is thoroughly checked and maintained. At Abe Garage, we also offer steering and suspension work, emission repairs, and computer diagnostic testing, making us your one-stop shop for all automotive needs. Our state-of-the-art facility and skilled team are dedicated to providing exceptional service, making sure your vehicle receives the best care possible. Whether you're in for a routine check-up or a more involved repair, you can trust Abe Garage to deliver reliable and efficient service every time.
                </p>
              </div>
              <div className="link-btn mt-40">
                <a href="/about" className="theme-btn btn-style-one style-two">
                  <span>
                    About Us <i className="flaticon-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About