const {vehicleService,singleVehicleService} = require('../../Backend/services/vehicle.service')

async function addVehicle(req, res) {
  try {
    const vehicleData = req.body;
    const result = await vehicleService.addVehicle(vehicleData);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in addVehicle controller:", error);
    return res.status(500).json({ status: "error", message: "Server Error" });
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

async function updateVehicle(req, res) {
    try {
        const updateVehicleData = req.body;
  

        const result = await vehicleService.updateVehicleInfo(updateVehicleData);

        if (result.error) {
            return res.status(500).json({
                status: "error",
                success: false,
                message: result.error,
                details: result.details
            });
        }

        if (!result.status) {
            return res.status(400).json({
                status: "fail",
                success: false,
                message: "Failed to update vehicle info"
            });
        }

        return res.status(200).json({
            status: "success",
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Unexpected server error:', error);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}


async function vehiclePerCustomer(req,res){

    try {

        const { customer_id }=req.params;
        const ID = customer_id

        const result = await vehicleService.vehiclePerCustomer(ID);
     

        if(result){

            res.status(200).json(result)
        } else{

            res.status(400).json({message:'not found '})
        }

    
    } catch (error) {
        return res.status(500).json({
            message:'Server Error'
        })
    }
}

async function deleteVehicle(req, res) {
    const {vehicle_id}=req.params
   
    try {
        const result = await vehicleService.deleteVehicle(vehicle_id );
  
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: " there is no vehicle found with this id " });
        }
  console.log("The Vehicle has been deleted")
        return res.status(200).json({ msg: "The vehicle has been deleted" });

    } catch (error) {
        console.error("Error deleting service:", error.message);
        return res.status(500).json({ msg: "Something went wrong" });
    }
  }

;



async function hasServiceOrder(req,res){

    try {

        const { vehicle_id }=req.params;
        const ID = vehicle_id

        const result = await vehicleService.hasServiceOrder(ID);
   
        if(result){

            res.status(200).json(result)
        } else{

            res.status(400).json({message:'not found '})
        }

    
    } catch (error) {
        return res.status(500).json({
            message:'Server Error'
        })
    }
}

module.exports={
    addVehicle,
    singleVehicle,
    updateVehicle,
    deleteVehicle,
    vehiclePerCustomer,
    hasServiceOrder

}