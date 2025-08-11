import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import customerService from "../../../../services/customer.service";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";


function AddCustomerForm() {

  const[customer_email,setCustomerEmail] = useState('')
  const[customer_first_name,setCustomerFirstName] = useState('')
  const[customer_last_name,setCustomerLastName] = useState('')
  const[customer_phone_number,setCustomerPhoneNumber] = useState('')
  const[active_customer_status,setCustomerActiveStatus] = useState('')
  const [spin, setSpinner] = useState(false);
  const {employee}= useAuth()
  const token = employee?.employee_token;
  const [emailError, setEmailError] = useState("");
  const [firstNameRequired, setFirstNameRequired] = useState("");
  const [phonenumberRequired, setPhoneNumberRequired] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate()

  const handleAddCustomer = async(e)=>{

    e.preventDefault()

    const customerdata ={
      customer_email,customer_first_name,customer_last_name,customer_phone_number,active_customer_status:1
    }
    setSpinner(true)

    let valid = true;
    if (!customer_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    } else {
      setFirstNameRequired("");
    }

    if (!customer_phone_number) {
      setPhoneNumberRequired("Phone number is required");
      valid = false;
    } else {
      setPhoneNumberRequired("");
    }


    if (!customer_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!customer_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(customer_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }


    if (!valid) {
      return;
    }

    try {

      const data = await customerService.createCustomer(customerdata,token)

      setServerMsg("Redirecting To Customers page...");
      setTimeout(()=>{
        navigate('/admin/customers');
        setSpinner(false)
      },1000)

    } catch (error) {
      console.log(error.response.data.msg)
      setServerError(error?.response?.data?.msg)
      setSpinner(false)
    }
  }

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new Customer</h2>
        </div>

      <div className="row clearfix">
        <div className="form-column col-lg-7">
          <div className="inner-column">
            <div className="contact-form">
              {serverMsg && (
                          <div
                            className="validation-error"
                            style={{
                              color: "green",
                              fontSize: "100%",
                              fontWeight: "600",
                              padding: "25px",
                            }}
                            role="alert"
                          >
                            {serverMsg}
                          </div>
                        )}

          

            <form onSubmit={handleAddCustomer}>
              <div className="row clearfix">

                 {serverError && <div className="validation-error" role="alert"   
                                    style={{
                                          color: "red",
                                          fontSize: "100%",
                                          fontWeight: "600",
                                          padding: "25px",
                                        }}>
                                      {serverError}
                                  </div>
                    }

                <div className="form-group col-md-12">  
                  <input
                      type="email"
                      name="Customer_email"
                      value={customer_email}
                      onChange={(e)=>setCustomerEmail(e.target.value)}
                      placeholder="Customer email"
                      required
                      />

                         {emailError && (
                            <div className="validation-error" role="alert">
                              {emailError}
                            </div>
                      )}
                </div>

                <div className="form-group col-md-12">
                  <input
                    type="text"
                    name="Customer_first_name"
                    required
                    value={customer_first_name}
                    onChange={(e)=>setCustomerFirstName(e.target.value)}
                     placeholder="Customer first name"
                      />
                        {firstNameRequired && (
                        <div className="validation-error" role="alert">
                          {firstNameRequired}
                        </div>
                      )}
                  </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        required
                        name="Customer_last_name"
                        value={customer_last_name}
                        onChange={(e)=>setCustomerLastName(e.target.value)}
                        placeholder="Customer last name"
                      
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="Customer_phone"
                        required
                        value={customer_phone_number}
                        onChange={(e)=>setCustomerPhoneNumber(e.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                      
                      />
                        {phonenumberRequired && (
                        <div className="validation-error" role="alert">
                          {phonenumberRequired}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>  {spin ? (
                              <BeatLoader color="white" size={8} />
                            ) : (
                              "ADD CUSTOMER"
                            )}</span>
                      </button>
                     
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddCustomerForm;
