import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import customerService from "../../../../Services/customer.service";
import vehicleService from "../../../../Services/vehicle.service";
import serviceService from "../../../../Services/service.service";
import { useAuth } from "../../../../context/AuthContext";
import "./CreateNewOrder.css";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { FaEdit } from "react-icons/fa";

const api_url = import.meta.env.VITE_API_URL;

function CreateNewOrder() {
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const employee_id = employee?.employee_id;

  const { ID, vID } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceDescription, setServiceDescription] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [notification, setNotification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch services
  const getServiceList = async () => {
    try {
      const servicesArray = await serviceService.getServiceList();
      setServices(servicesArray || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch single customer
  const fetchSingleCustomerData = async () => {
    if (!token) return;
    try {
      const data = await customerService.singleCustomer(ID, token);
      setCustomerInfo(data.customer?.[0] || null);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  // Fetch vehicle info
  const fetchVehicleInfo = async () => {
    if (!vID || !token) return;
    try {
      const vehicle = await vehicleService.getVehicleInfo(vID, token);
      setVehicleInfo(vehicle || null);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setErrorMessage("Failed to fetch vehicle information");
    }
  };

  useEffect(() => {
    getServiceList();
    fetchSingleCustomerData();
  }, [token, ID]);

  useEffect(() => {
    fetchVehicleInfo();
  }, [vID, token]);

  // Handle service selection
  const handleServiceSelection = (service_id) => {
    setSelectedServices((prev) =>
      prev.includes(service_id)
        ? prev.filter((id) => id !== service_id)
        : [...prev, service_id]
    );
  };

  // Handle order description auto-update
  useEffect(() => {
    const description = selectedServices
      .map((serviceId) => {
        const s = services.find((srv) => srv.service_id === serviceId);
        return s?.service_description || "";
      })
      .join(" ");
    setOrderDescription(description);
  }, [selectedServices, services]);

  const handleSubmit = async () => {
    if (!customerInfo || !vehicleInfo) {
      setErrorMessage("Customer or vehicle info is missing");
      return;
    }

    const requestBody = {
      employee_id,
      customer_id: customerInfo.customer_id,
      vehicle_id: vehicleInfo.vehicle_id,
      active_order: 2,
      order_description: orderDescription,
      estimated_completion_date: estimatedCompletionDate,
      completion_date: null,
      order_completed: 0,
      order_status: 3,
      order_total_price: orderTotalPrice,
      additional_request: serviceDescription,
      order_services: selectedServices.map((id) => ({
        service_id: id,
        service_completed: false,
      })),
    };

    try {
      const response = await fetch(`${api_url}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setNotification("Order successfully submitted");

      setTimeout(() => navigate("/admin/orders"), 2000);
    } catch (error) {
      setErrorMessage("Error submitting order: " + error.message);
      console.error(error);
    }
  };

  // Redirect helpers
  const handleRedirectCustomer = () => navigate("/admin/create-order");
  const handleRedirectVehicle = () =>
    navigate(`/admin/order-single/${ID}`);

  return (
    <div className="create-order-container">
      {notification && (
        <div
          onClick={() => {
            setNotification("");
            navigate("/admin/orders");
          }}
          className="notification_main"
        >
          <div className="notification">
            {notification} <br />
            <button onClick={() => navigate("/admin/orders")}>Ok</button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

   {/* Customer Info */}
{customerInfo ? (
  <div className="CustomerInfo p-4 bg-white shadow rounded-lg mb-6">
    <div className="CustomerInfo_two flex justify-between items-center mb-4">
      <h2 className="customer_name text-xl font-bold text-gray-800">
        {customerInfo.customer_first_name}{" "}
        <span>{customerInfo.customer_last_name}</span>
      </h2>
      <CancelPresentationIcon
        onClick={handleRedirectCustomer}
        className="icon cursor-pointer text-red-500"
      />
    </div>
    <p>
      <span className="font-semibold">Email:</span>{" "}
      <span>{customerInfo.customer_email}</span>
    </p>
    <p>
      <span className="font-semibold">Phone Number:</span>{" "}
      <span>{customerInfo.customer_phone_number}</span>
    </p>
    <p>
      <span className="font-semibold">Active Customer:</span>{" "}
      <span>
        {customerInfo.active_customer_status ? "Yes" : "No"}
      </span>
    </p>
    <p>
      <span className="font-semibold">Edit customer info:</span>{" "}
      <Link to={`/admin/edit-customer/${customerInfo.customer_id}`}>
        <FaEdit className="inline ml-2 text-blue-600 cursor-pointer" size={20} />
      </Link>
    </p>
  </div>
) : (
  <p>Loading customer information...</p>
)}

   {/* Vehicle Info */}
{/* Vehicle Info */}
{/* Vehicle Info */}
{vehicleInfo ? (
  <div className="VehicleInfo p-4 bg-white shadow rounded-lg mb-6">
    <div className="VehicleInfo_header flex justify-between items-center mb-4">
      <h2 className="vehicle_name text-xl font-bold text-gray-800">
        {vehicleInfo.vehicle_make}{" "}
        <span>{vehicleInfo.vehicle_model || ""}</span>
      </h2>
      <CancelPresentationIcon
        onClick={handleRedirectVehicle}
        className="cancel-icon"
      />
    </div>

    <p>
      <span className="label">Vehicle Color:</span>
      <span className="value">{vehicleInfo.vehicle_color || "-"}</span>
    </p>
    <p>
      <span className="label">Vehicle Tag:</span>
      <span className="value">{vehicleInfo.vehicle_tag || "-"}</span>
    </p>
    <p>
      <span className="label">Vehicle Year:</span>
      <span className="value">{vehicleInfo.vehicle_year || "-"}</span>
    </p>
    <p>
      <span className="label">Vehicle Mileage:</span>
      <span className="value">{vehicleInfo.vehicle_mileage || "-"}</span>
    </p>
    <p>
      <span className="label">Vehicle Serial:</span>
      <span className="value">{vehicleInfo.vehicle_serial || "-"}</span>
    </p>

    {/* Edit button separate from cancel icon */}
    <div className="mt-4">
      <Link
        to={`/admin/edit-vehicle/${vehicleInfo.vehicle_id}`}
        className="edit-btn"
      >
        Edit Vehicle
      </Link>
    </div>
  </div>
) : (
  <p>Loading vehicle information...</p>
)}




      {/* Services Selection */}
      <div className="service_list_container">
        <h2 className="customer_name v_font">Choose service</h2>
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.service_id} className="service-item">
              <div className="service-d w-100">
                <div>
                  <h3 className="service_font">{service.service_name}</h3>
                  <p>{service.service_description}</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.service_id)}
                    onChange={() => handleServiceSelection(service.service_id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No services available</p>
        )}
      </div>

      {/* Additional Requests */}
    {/* Additional Requests */}
<div className="additional-requests p-4 bg-gray-50 rounded-lg mt-6">
  <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
    Additional requests
  </h2>

  <input
    type="text"
    className="w-100 mb-3 p-2 border rounded"
    placeholder="Service Description"
    value={serviceDescription}
    onChange={(e) => setServiceDescription(e.target.value)}
  />

  <input
    type="text"
    className="w-100 mb-3 p-2 border rounded"
    placeholder="Price"
    value={orderTotalPrice}
    onChange={(e) => setOrderTotalPrice(e.target.value)}
  />

  <input
    type="text"
    className="w-100 mb-3 p-2 border rounded"
    placeholder="Order Description"
    value={orderDescription}
    onChange={(e) => setOrderDescription(e.target.value)}
  />

  <label className="block mb-3">
    Expected Completion Date:
    <input
      type="datetime-local"
      className="ml-2 p-2 border rounded"
      value={estimatedCompletionDate}
      onChange={(e) => setEstimatedCompletionDate(e.target.value)}
    />
  </label>

  <button className="submit-order mt-4 mb-5 px-6 py-2 rounded">
    SUBMIT ORDER
  </button>
</div>

    </div>
  );
}

export default CreateNewOrder;
