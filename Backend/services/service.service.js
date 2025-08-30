const pool = require("../config/db.config")
async function createService(common_services) {
  try {
    // SQL query
    const sql = `INSERT INTO common_services (service_name, service_description) VALUES (?, ?)`;
    const params = [
      common_services.service_name,
      common_services.service_description
    ];

    // Execute the query
    const result = await pool.query(sql, params);

    return result;
  } catch (error) {
    // Handle any errors
    console.error("Error creating service:", error);
    throw new Error("Could not create service. Please try again later."); 
  }
}
async function updateService(service_id, service_name, service_description) {
  try {
    const result = await pool.query(
      "UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?",
      [service_name, service_description, service_id]
    );

    return result;
  } catch (error) {
    throw new Error("Error updating service: " + error.message);
  }
}
async function deleteService(service_id) {
  try {
    const result = await pool.query(
      "DELETE FROM common_services WHERE service_id = ?",
      [ service_id]
    );

    return result;
  } catch (error) {
    throw new Error("Error Deleting service: " + error.message);
  }
}
async function getAllServices() {
  try {
    const sql = `SELECT * FROM common_services`;
    const [rows] = await pool.query(sql); // use array destructuring
    return rows;
  } catch (error) {
    console.error("Error getting services:", error);
    throw new Error("Could not get services. Please try again later.");
  }
}

module.exports ={
    createService,
    updateService,
    deleteService,
    getAllServices
}