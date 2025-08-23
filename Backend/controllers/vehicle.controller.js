const {vehicleService,singleVehicleService} = require('../services/vehicle.service')

async function addVehicle(req, res) {
  try {
    const vehicleData = req.body;

    const result = await vehicleService.addVehicle(vehicleData);
    let response = {};

    if (!result.success) {
      response = {
        status: "fail",
        success: false,
        message: result.message || "failed to add vehicle",
      };
      return res.status(400).json(response);
    }

    response = {
      status: "success",
      success: true,
      data: result,
    };

    return res.status(201).json(response); // 201 for created resource
  } catch (error) {
    console.error("Error in addVehicle controller:", error);
    return res.status(500).json({
      status: "fail",
      success: false,
      message: "Server Error",
    });
  }
}
async function singleVehicle(req, res) {
  try {
    const { id } = req.params;

    const result = await singleVehicleService(id); 

    if (!result || result.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Vehicle does not exist",
        data: []
      });
    }

    return res.status(200).json({
      status: "success",
      data: result
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error"
    });
  }
}



module.exports={
    addVehicle,
    singleVehicle
}