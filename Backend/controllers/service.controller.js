const serviceService = require("../services/service.service");

// create service
async function createService(req, res, next) {
  try {
    const serviceData = req.body; 
    console.log("Received service data:", serviceData); 
    const service = await serviceService.createService(serviceData);
    if (!service) {
      return res.status(400).json({
        error: "Failed to add the service!",
      });
    }
    res.status(200).json({
      status: "Service added successfully",
   
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
}
async function updateService(req, res) {
    const {  service_name, service_description  } = req.body;
    const {id}=req.params
    const service_id =id
   
    if (!service_name || !service_description) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    try {
        const result = await serviceService.updateService(service_id, service_name, service_description);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Service not found" });
        }

        return res.status(200).json({ msg: "The service has been updated" });
    } catch (error) {
        console.error("Error updating service:", error.message);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}
async function deleteService(req, res) {
  const { service_name, service_description } = req.body;
  const {service_id}=req.params
  
  try {
      const result = await serviceService.deleteService(service_id );
      console.log(result)

      if (result.affectedRows === 0) {
          return res.status(404).json({ msg: "Service not found" });
      }

      return res.status(200).json({ msg: "The service has been deleted" });
  } catch (error) {
      console.error("Error deleting service:", error.message);
      return res.status(500).json({ msg: "Something went wrong" });
  }
}
async function getSingleService(req, res, next) {
  try {
    const serviceId = req.params.id;
    const service = await serviceService.getSingleService(serviceId);
    res.status(200).json({
      status: 'success',
      data: service, 
      
    });
  } catch (error) {
    console.error('Error getting single service:', error);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
}
async function getAllServices(req, res) {
  try {
    const services = await serviceService.getAllServices();

    if (!services || services.length === 0) {
      return res.status(404).json({ error: "No services found" });
    }

    res.status(200).json({
      status: "success",
      data: services,
    });
  } catch (error) {
    console.error("Server error in getAllServices:", error.message);
    res.status(500).json({ error: "Failed to get all services!" });
  }
}



module.exports={
createService,
updateService,
deleteService,
getSingleService,
getAllServices
}

