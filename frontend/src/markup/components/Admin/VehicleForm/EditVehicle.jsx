import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import vehicleService from "../../../../Services/vehicle.service";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const EditVehicleForm = ({ vid }) => {
  const vehicle_id = vid;
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState("");
  const { employee } = useAuth();
  const token = employee?.employee_token;

  const [customer, setCustomer] = useState("");
  const [vehicle_year, setVehicleYear] = useState("");
  const [vehicle_make, setVehicleMake] = useState("");
  const [vehicle_model, setVehicleModel] = useState("");
  const [vehicle_type, setVehicleType] = useState("");
  const [vehicle_mileage, setVehicleMileage] = useState("");
  const [vehicle_tag, setVehicleTag] = useState("");
  const [vehicle_serial, setVehicleSerial] = useState("");
  const [vehicle_color, setVehicleColor] = useState("");

  const navigate = useNavigate();
  const [spin, setSpinner] = useState(false);
  const [isOrderExist, setIsOrderExist] = useState(false);
  const [vehicleExists, setVehicleExists] = useState(true);

  // Check if this vehicle has service orders
  const hasServicedThisVehicle = async () => {
    try {
      const count = await vehicleService.hasServiceOrder(vehicle_id, token);
      if (count >= 1) {
        setIsOrderExist(true);
        setError(
          `Updating this vehicle's information is unavailable due to an existing order. Adding a new vehicle is still allowed.`
        );
      }
    } catch (err) {
      console.error(err);
      setServerError("Internal Server Error! Try again.");
    }
  };

  // Fetch vehicle info
const fetchVehicle = async () => {
  try {
    const vehicle = await vehicleService.getVehicleInfo(vehicle_id, token);
    console.log("Fetched vehicle:", vehicle);

    if (!vehicle) {
      setFof4(true);
      return;
    }

    setCustomer(`${vehicle.customer_first_name} ${vehicle.customer_last_name}`);
    setVehicleYear(vehicle.vehicle_year);
    setVehicleMake(vehicle.vehicle_make);
    setVehicleModel(vehicle.vehicle_model);
    setVehicleType(vehicle.vehicle_type);
    setVehicleMileage(vehicle.vehicle_mileage);
    setVehicleTag(vehicle.vehicle_tag);
    setVehicleSerial(vehicle.vehicle_serial);
    setVehicleColor(vehicle.vehicle_color);
  } catch (err) {
    console.error(err);
    setServerError("Internal Server Error!, try again");
  }
};


  useEffect(() => {
    if (employee && token) {
      hasServicedThisVehicle();
      fetchVehicle();
    }
  }, [employee, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    setError("");
    setServerError("");

    if (!vehicle_id) {
      setError("No vehicle selected.");
      setSpinner(false);
      return;
    }

    const formData = {
      vehicle_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    };

    try {
      await vehicleService.updateVehicle({ ...formData }, token);
      setTimeout(() => {
        setSpinner(false);
        navigate("/admin/create-order");
      }, 1000);
    } catch (err) {
      console.error(err);
      setServerError("Internal Server Error! Try again.");
      setSpinner(false);
    }
  };

  // Optional: Add Vehicle if it doesn't exist
  const handleAddVehicle = async () => {
    try {
      const formData = {
        customer_id: vehicle_id, // adjust if needed
        vehicle_year,
        vehicle_make,
        vehicle_model,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color,
      };
      const result = await vehicleService.AddVehicle(formData, token);
      console.log("Vehicle added:", result);
      fetchVehicle();
    } catch (err) {
      console.error(err);
      setServerError("Failed to add vehicle.");
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title edit_vehicle">
          <h2>
            {vehicleExists
              ? `Edit ${customer ? `${customer}'s ` : ""}vehicle info`
              : `Add vehicle for ${customer}`}
          </h2>
        </div>

        {serverError && <div className="validation-error">{serverError}</div>}
        {error && <div className="validation-error">{error}</div>}

        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                {(vehicleExists && !isOrderExist) || !vehicleExists ? (
                  <form onSubmit={vehicleExists ? handleSubmit : handleAddVehicle}>
                    <div className="row clearfix">
                      <div className="form-group col-md-12">
                        <input
                          type="number"
                          value={vehicle_year}
                          onChange={(e) => setVehicleYear(e.target.value)}
                          placeholder="Vehicle year"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_make}
                          onChange={(e) => setVehicleMake(e.target.value)}
                          placeholder="Vehicle make"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_model}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="Vehicle model"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_type}
                          onChange={(e) => setVehicleType(e.target.value)}
                          placeholder="Vehicle type"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="number"
                          value={vehicle_mileage}
                          onChange={(e) => setVehicleMileage(e.target.value)}
                          placeholder="Vehicle mileage"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_tag}
                          onChange={(e) => setVehicleTag(e.target.value)}
                          placeholder="Vehicle tag"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_serial}
                          onChange={(e) => setVehicleSerial(e.target.value)}
                          placeholder="Vehicle serial"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <input
                          type="text"
                          value={vehicle_color}
                          onChange={(e) => setVehicleColor(e.target.value)}
                          placeholder="Vehicle color"
                          required
                        />
                      </div>

                      <div className="form-group col-md-12">
                        <button className="theme-btn btn-style-one" type="submit">
                          <span>
                            {vehicleExists ? "UPDATE VEHICLE" : "ADD VEHICLE"}{" "}
                            {spin && <BeatLoader color="white" size={8} />}
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p>Cannot update vehicle due to existing order.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditVehicleForm;
