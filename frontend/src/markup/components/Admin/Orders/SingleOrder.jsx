import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsHandIndexThumbFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../../context/AuthContext";
import vehicleService from "../../../../Services/vehicle.service";

const SingleOrder = () => {
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const { customer_id } = useParams();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [vehiclePerCustomer, setVehiclePerCustomer] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiclePerCustomer = async () => {
    if (!token) return;

    try {
      const response = await vehicleService.getVehicleInfoPerCustomer(customer_id, token);
      const vehicleObject = response?.data?.data;

      if (vehicleObject) {
        setCustomerInfo(vehicleObject);
        setVehiclePerCustomer([vehicleObject]); // Assuming only 1 vehicle per customer
      } else {
        setCustomerInfo(null);
        setVehiclePerCustomer([]);
      }
    } catch (error) {
      console.error("Error fetching vehicle/customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && customer_id) {
      fetchVehiclePerCustomer();
    }
  }, [token, customer_id]);

  const handleAddVehicle = () => {
    navigate(`/admin/add-vehicle/${customer_id}`);
  };

  if (loading) return <p>Loading customer information...</p>;
  if (!customerInfo) return <p>Customer information not found.</p>;

  return (
    <div className="single-order-wrapper px-4 py-3">

      {/* === Customer Info Section === */}
      <section className="info-section mb-4">
        <h2 className="text-primary fw-bold">
          Customer: {customerInfo.customer_first_name} {customerInfo.customer_last_name}
        </h2>
        <p><strong>Email:</strong> {customerInfo.customer_email}</p>
        <p><strong>Phone Number:</strong> {customerInfo.customer_phone_number}</p>
        <p><strong>Active Customer:</strong> {customerInfo.active_customer_status ? "Yes" : "No"}</p>
        <p>
          <strong>Edit customer info: </strong>
          <Link to={`/admin/edit-customer/${customerInfo.customer_id}`}>
            <FaEdit className="ms-2" size={18} />
          </Link>
        </p>
      </section>

      {/* === Vehicle Section === */}
      <section className="vehicle-section mb-4">
        <h3 className="fw-bold">Vehicles of {customerInfo.customer_first_name}</h3>

        {vehiclePerCustomer.length > 0 ? (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Year</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Tag</th>
                  <th>Serial</th>
                  <th>Color</th>
                  <th>Mileage</th>
                  <th>Choose</th>
                </tr>
              </thead>
              <tbody>
                {vehiclePerCustomer.map((vehicle) => (
                  <tr key={vehicle.vehicle_id}>
                    <td>{vehicle.vehicle_year}</td>
                    <td>{vehicle.vehicle_make}</td>
                    <td>{vehicle.vehicle_model}</td>
                    <td>{vehicle.vehicle_tag}</td>
                    <td>{vehicle.vehicle_serial}</td>
                    <td>{vehicle.vehicle_color}</td>
                    <td>{vehicle.vehicle_mileage}</td>
                    <td>
                      <Link
                        to={`/admin/order/${customer_id}/${vehicle.vehicle_id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <BsHandIndexThumbFill />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted mt-2">No vehicle found</p>
        )}

        <button onClick={handleAddVehicle} className="btn btn-danger mt-3">
          ADD NEW VEHICLE
        </button>
      </section>

      {/* === Orders Section === */}
      <section className="orders-section">
        <h3 className="fw-bold">Orders of {customerInfo.customer_first_name}</h3>
        <p className="text-muted">Orders will be displayed here</p>
      </section>
    </div>
  );
};

export default SingleOrder;
