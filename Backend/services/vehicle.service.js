const pool = require("../config/db.config");
async function addVehicle(vehicleData) {
  let response = {
    status: "fail",
    success: false,
    message: "failed to add vehicle",
  };

  const {
    customer_id,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color,
  } = vehicleData;

  // Validate required fields
  if (
    !customer_id ||
    !vehicle_year ||
    !vehicle_make ||
    !vehicle_model ||
    !vehicle_type ||
    !vehicle_mileage ||
    !vehicle_tag ||
    !vehicle_serial ||
    !vehicle_color
  ) {
    response.message = "Missing or invalid required fields";
    return response;
  }

  try {
    const vehicleAddQuery = `
      INSERT INTO customer_vehicle_info
      (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await pool.query(vehicleAddQuery, [
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    ]);

    console.log("Insert result:", result);

    if (result.affectedRows > 0) {
      response = {
        status: "success",
        success: true,
        message: "Vehicle added successfully",
        insertId: result.insertId,
      };
    } else {
      response.message = "No rows affected, vehicle not added";
    }
  } catch (error) {
    console.error("Database error adding vehicle:", error);
    response.message = `Internal Server Error: ${error.message}`;
  }

  console.log("Response:", response);
  return response;
}









module.exports = {
  addVehicle,
 
};
