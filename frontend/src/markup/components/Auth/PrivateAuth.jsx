import React, {useState, useEffect} from "react";
import {Navigate} from 'react-router-dom'
import EmployeeAuthHeader from "../../../utils/auth_headers";

const PrivateAuthRoute =({roles, children})=>{
    const [isLoggedin, setLogged]=useState(false)
    const [isAuthorized ,setIsAuthorized] =useState(false)
    const [isChecked,setIsChecked] =useState(false)
    useEffect(()=>{
        const loggedInEmployee = EmployeeAuthHeader()

        loggedInEmployee.then((response)=>{
            if(response.employee_token){
                setLogged(true)
                if (roles && roles.length>0&&roles.includes(response.employee_role)){
                    setIsAuthorized(true)
                }
            }
            setIsChecked(true)
        });
    },[roles]);
    if(isChecked){
        if(!isLoggedin){
            return <Navigate to ="/login"/>
        }
        if(!isAuthorized){
            return <Navigate to ="/unauthorized"/>
        }
    }
    return children
}
export default PrivateAuthRoute;