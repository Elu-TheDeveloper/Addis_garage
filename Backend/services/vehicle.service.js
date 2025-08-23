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

async function singleVehicleService(ID) {
    try {
        const singleVehicleQuery = `
            SELECT customer_identifier.*, customer_info.*, customer_vehicle_info.* 
            FROM customer_identifier 
            INNER JOIN customer_info 
                ON customer_identifier.customer_id = customer_info.customer_id
            INNER JOIN customer_vehicle_info 
                ON customer_identifier.customer_id = customer_vehicle_info.customer_id
            WHERE customer_vehicle_info.vehicle_id = ?
        `;

        // console.log("Vehicle ID:", ID);

        // Destructure rows from mysql2/promise query
        const [rows] = await pool.query(singleVehicleQuery, [ID]);

        return rows;
    } catch (error) {
        console.error("Error getting vehicle:", error);
        throw new Error("Could not get vehicle. Please try again later.");
    }
}



module.exports = {
  addVehicle,
  singleVehicleService
 
};
