const pool = require('../config/db.config'); // Adjust path to your database config

async function addVehicle(vehicleData) {
  let response = {
    status: 'fail',
    success: false,
    message: 'failed to add vehicle',
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
    response.message = 'Missing or invalid required fields';
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
    
    if (result.affectedRows > 0) {
      response = {
        status: 'success',
        success: true,
        message: 'Vehicle added successfully',
        insertId: result.insertId,
      };
    } else {
      response.message = 'No rows affected, vehicle not added';
    }
  } catch (error) {
    console.error('Database error adding vehicle:', error);
    response.message = `Internal Server Error: ${error.message}`;
  }

  console.log('Response:', response);
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



        // Destructure rows from mysql2/promise query
        const [rows] = await pool.query(singleVehicleQuery, [ID]);

        return rows;
    } catch (error) {
        console.error("Error getting vehicle:", error);
        throw new Error("Could not get vehicle. Please try again later.");
    }
}

async function updateVehicleInfo(updateVehicleData) {
    const {
        vehicle_id,
        vehicle_year,
        vehicle_make,
        vehicle_model,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color
    } = updateVehicleData;

    let response = {}

    if (!vehicle_id || !vehicle_year || !vehicle_make || !vehicle_model || !vehicle_type || !vehicle_mileage || !vehicle_tag || !vehicle_serial || !vehicle_color) {
        return { error: 'Missing required fields' };
    }

    try {
        const updateVehicleQuery = `
            UPDATE customer_vehicle_info 
            SET 
                vehicle_year = ?, 
                vehicle_make = ?, 
                vehicle_model = ?, 
                vehicle_type = ?,  
                vehicle_mileage = ?, 
                vehicle_tag = ?, 
                vehicle_serial = ?, 
                vehicle_color = ?  
            WHERE vehicle_id = ?`;

        const result = await pool.query(updateVehicleQuery, [
            vehicle_year,
            vehicle_make,
            vehicle_model,
            vehicle_type,
            vehicle_mileage,
            vehicle_tag,
            vehicle_serial,
            vehicle_color,
            vehicle_id
        ]);


        if (result.affectedRows !== 0) {
            response = { status: result.affectedRows }
        } else {
            response = { status: 0 }
        }

    } catch (error) {
        console.error('Update vehicle query failed:', error);
        return { error: 'Internal Server Error', details: error.message };
    }

    return response;
}

async function deleteVehicle(vehicle_id) {
    try {
      const result = await pool.query(
        "DELETE FROM customer_vehicle_info WHERE vehicle_id = ?",
        [ vehicle_id]
      );
  
      return result;
    } catch (error) {
      throw new Error("Error Deleting service: " + error.message);
    }
  }

async function vehiclePerCustomer(ID) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM customer_vehicle_info WHERE customer_id = ?`,
      [ID]
    );

    console.log("DEBUG rows:", rows); // 👈 check here

    return { result: rows }; // always array, even if only 1 record
  } catch (error) {
    console.error("Error getting Vehicle:", error);
    throw new Error("Could not get vehicle. Please try again later.");
  }
}







async function hasServiceOrder(ID){
    try {
        console.log("vehicle_id",ID)
        let response={}
        const query = `SELECT * FROM orders WHERE vehicle_id = ?`
        const result = await pool.query(query,[ID]);
        console.log(result,result.length)

        if(result.length == 0){
            return response;
        }

        response ={
            
            result
        }
        // console.log(response)

        return response;
        
        
    } catch (error) {
        console.error("Error getting Vehicle:", error);
        throw new Error("Could not get vehicle. Please try again later.");
    }
}
async function searchVehicle(customer_id, query) {
  try {
    // Clean the input to remove any newline characters
    const cleanQuery = query.replace(/\n/g, "").trim();

    const sql = `
      SELECT * FROM customer_vehicle_info 
      WHERE customer_id = ? AND (
        vehicle_make LIKE ? OR 
        vehicle_model LIKE ? OR 
        vehicle_serial LIKE ?
      )
    `;
    const values = [
      customer_id,
      `%${cleanQuery}%`,
      `%${cleanQuery}%`,
      `%${cleanQuery}%`,
    ];

    console.log("SQL Query:", sql);
    console.log("Values:", values);
    const result = await pool.query(sql, values);
    console.log()
    return result;
  } catch (error) {
    console.error("Error searching vehicles:", error.message);
    throw new Error("Database Error");
  }
}
module.exports = {
  vehicleService: { addVehicle,  
    updateVehicleInfo,
     vehiclePerCustomer,
     hasServiceOrder,
     deleteVehicle,
     searchVehicle },
  singleVehicleService,

};