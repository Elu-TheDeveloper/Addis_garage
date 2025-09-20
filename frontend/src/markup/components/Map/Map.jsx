import React from 'react'

const Map = () => {

    const style={
        maxWidth:'1200px',
        height:'600px',
        textAlign:'center',
        display:'flex',
        justifyContent:'center'
    }
  return (
     <div className=" pl-lg-5">
          <section className="map-section">
            <div className="contact-map" style={style}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3071.2910802067827!2d90.45905169331171!3d23.691532202989123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1577214205224!5m2!1sen!2sbd"
                width="1000"
                height="470"
                
                // style={{ border: 0, width: "%" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </section>
        </div> 
  )
}

export default Map