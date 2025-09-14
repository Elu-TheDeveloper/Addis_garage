const { query } = require("../config/db.config");

// Create service
async function createService(common_services) {
  try {
    const sql = `INSERT INTO common_services (service_name, service_description) VALUES (?, ?)`;
    const result = await query(sql, [
  common_services.service_name,
  common_services.service_description,
]);
return result;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Could not create service. Please try again later.");
  }
}

// Update service
async function updateService(service_id, service_name, service_description) {
  try {
    const result = await query(
      "UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?",
      [service_name, service_description, service_id]
    );

    return result; 
  } catch (error) {
    throw new Error("Error updating service: " + error.message);
  }
}


// Delete service
async function deleteService(service_id) {
  try {
    const result = await query(
      "DELETE FROM common_services WHERE service_id = ?",
      [service_id]
    );
    return result; 
    // But ⚠️ here `result` might just be [] not { affectedRows }
  } catch (error) {
    throw new Error("Error deleting service: " + error.message);
  }
}

// Get single service
async function getSingleService(service_id) {
  try {
    const sql = `SELECT * FROM common_services WHERE service_id = ?`;
    const [rows] = await pool.query(sql, [service_id]);
    return rows[0]; // return the first row (one service)
  } catch (error) {
    console.error("Error getting single service:", error);
    throw new Error("Could not get service. Please try again later.");
  }
}

// Get all services
async function getAllServices() {
  try {
    const sql = `SELECT * FROM common_services`;
    const rows = await query(sql);  // ✅ wrapper already returns rows (array)
    return rows;
  } catch (error) {
    console.error("Error getting services:", error);
    throw new Error("Could not get services. Please try again later.");
  }
}





module.exports = {
  createService,
  updateService,
  deleteService,
  getSingleService,
  getAllServices,
};
