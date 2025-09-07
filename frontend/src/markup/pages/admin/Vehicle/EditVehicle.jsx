import React from 'react'
import AdminMenu from '../../../components/AdminMenu/AdminMenu'
import EditVehicleForm from '../../../../markup/components/Admin/VehicleForm/EditVehicle'
import { useParams } from 'react-router-dom'


const EditVehicle = () => {
    const{id}= useParams()
    // console.log(id)

  return (
    <div>
        <div className="container-fluid admin-pages">
        <div className="row">
            <div className="col-md-3 admin-left-side">
               <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
               <EditVehicleForm vid={id} />
            </div>
        </div>
        </div>
  </div>
  )
}

export default EditVehicle