import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../../../services/customer.service"; // Verify this path
import { useAuth } from "../../../../context/AuthContext";
import classes from "./edit.module.css";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { employee } = useAuth();
  const token = employee?.employee_token;

  const [loading, setLoading] = useState(true);
  const [customer_first_name, setFirstName] = useState("");
  const [customer_last_name, setLastName] = useState("");
  const [customer_phone_number, setPhoneNumber] = useState("");
  const [customer_email, setEmail] = useState("");
  const [active_customer_status, setActiveCustomerStatus] = useState(false);
  const [spin, setSpinner] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const firstNameTracker = (e) => setFirstName(e.target.value);
  const lastNameTracker = (e) => setLastName(e.target.value);
  const phoneNumberTracker = (e) => setPhoneNumber(e.target.value);
  const emailTracker = (e) => setEmail(e.target.value);
  const activeCustomerStatusTracker = (e) =>
    setActiveCustomerStatus(e.target.checked);

  const fetchData = async () => {
    try {
      console.log("customerService available methods:", Object.keys(customerService));
      // Attempt to call the function, assuming it's part of the service
      const response = await customerService.getSingleCustomer(customerId, token);
      console.log("Fetched customer data:", response);

      if (response && response.customer && response.customer.length > 0) {
        const customer = response.customer[0];
        setFirstName(customer.customer_first_name || "");
        setLastName(customer.customer_last_name || "");
        setPhoneNumber(customer.customer_phone_number || "");
        setEmail(customer.customer_email || "");
        setActiveCustomerStatus(Boolean(customer.active_customer_status));
      } else {
        throw new Error("No customer data found");
      }
      setApiError(false);
      setApiErrorMessage("");
    } catch (error) {
      console.error("Fetch error:", error);
      setApiError(true);
      setApiErrorMessage("Failed to fetch customer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && customerId) {
      fetchData();
    }
  }, [token, customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    const formData = {
      customer_id: customerId,
      customer_first_name,
      customer_last_name,
      customer_phone_number,
      customer_email,
      active_customer_status: active_customer_status ? 1 : 0,
    };

    try {
      const result = await customerService.updateCustomer(formData, token);
      console.log("Update result:", result);

      if (result.status === "Customer successfully updated!") {
        await fetchData();
        setServerMsg("Customer updated! Redirecting...");
        setTimeout(() => {
          setSpinner(false);
          navigate("/admin/customers");
        }, 1000);
      } else if (result.status === "No changes detected, customer remains unchanged!") {
        setServerMsg("No changes detected.");
        setSpinner(false);
      } else {
        setServerMsg("Update failed. Please try again.");
        setSpinner(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      setServerMsg("Update failed. Please try again.");
      setSpinner(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={`${classes.contactSection} contact-section`}>
      <div className="auto-container">
        <div className={`${classes.contactTitle} contact-title`}>
          <h2>Edit Customer: {customer_email || ""}</h2>
        </div>

        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className={classes.contactForm}>
                {apiError && (
                  <div className="validation-error" role="alert">
                    {apiErrorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className={`${classes.formGroup} col-md-12`}>
                      <input
                        type="text"
                        name="customer_first_name"
                        placeholder="Customer first name"
                        value={customer_first_name}
                        onChange={firstNameTracker}
                        className={classes.formInput}
                        required
                      />
                    </div>

                    <div className={`${classes.formGroup} col-md-12`}>
                      <input
                        type="text"
                        name="customer_last_name"
                        placeholder="Customer last name"
                        value={customer_last_name}
                        onChange={lastNameTracker}
                        className={classes.formInput}
                        required
                      />
                    </div>

                    <div className={`${classes.formGroup} col-md-12`}>
                      <input
                        type="text"
                        name="customer_phone"
                        placeholder="Customer phone (555-555-5555)"
                        value={customer_phone_number}
                        onChange={phoneNumberTracker}
                        className={classes.formInput}
                        required
                      />
                    </div>

                    <div className={`${classes.formGroup} col-md-12`}>
                      <input
                        type="email"
                        name="customer_email"
                        placeholder="Customer email"
                        value={customer_email}
                        onChange={emailTracker}
                        className={classes.formInput}
                        required
                      />
                    </div>

                    <div className={`${classes.formGroup} col-md-12 form-control`}>
                      <label
                        className={classes.formCheckboxLabel}
                        htmlFor="activeCustomer"
                      >
                        Active Customer
                      </label>
                      <input
                        type="checkbox"
                        name="activeCustomer"
                        checked={active_customer_status}
                        onChange={activeCustomerStatusTracker}
                        className={classes.formCheckbox}
                      />
                    </div>

                    <div className={`${classes.formGroup} col-md-12`}>
                      <button
                        type="submit"
                        className={classes.themeBtn}
                        data-loading-text="Please wait..."
                      >
                        {spin ? <BeatLoader color="white" size={8} /> : "Update Customer"}
                      </button>

                      {serverMsg && (
                        <div
                          className="validation-error"
                          style={{
                            color: serverMsg.includes("failed") ? "red" : "green",
                            fontSize: "100%",
                            fontWeight: "600",
                            padding: "20px",
                          }}
                          role="alert"
                        >
                          {serverMsg}
                        </div>
                      )}
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
};

export default EditCustomer;