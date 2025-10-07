import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const Email = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const form = useRef(null);


  useEffect(() => {
    emailjs.init("public_i2W9erpJHlDsKxaT3"); // replace with your real PUBLIC KEY from EmailJS dashboard
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_0y66tt8", "template_rgmiic7", form.current)
      .then(
        () => {
          console.log("SUCCESS!");
          setMessage("Your message has been sent successfully!");
          setMessageType("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          console.error("FAILED...", error);
          setMessage("Failed to send your message. Please try again.");
          setMessageType("error");
        }
      );
  };

  return (
    <div className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Contact Us</h2>
        </div>

        <div className="row clearfix">
          <div className="form-column col-lg">
            <div className="inner-column">
              <div className="contact-form">
                {message && (
                  <div
                    className={`alert ${
                      messageType === "success"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form ref={form} onSubmit={sendEmail}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                 
                      <input type="text" name="from_name" placeholder="Name" required />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        name="reply_to"
                        placeholder="Your Email"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12 contact_us">
                      <textarea
                        name="message"
                        placeholder="Your message"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>SEND</span>
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
