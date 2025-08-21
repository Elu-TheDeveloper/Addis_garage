import React, { useState, useEffect, useContext } from 'react';
import EmployeeAuthHeader from '../utils/auth_headers';

const AuthContext = React.createContext(); 

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedin, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const loggedInEmployee = EmployeeAuthHeader();

    if (loggedInEmployee && typeof loggedInEmployee.then === 'function') {
      loggedInEmployee
        .then((response) => {
          if (response?.employee_token) {
            setIsLogged(true);

            if (response.employee_role === 3) {
              setIsAdmin(true);
            }

            setEmployee(response);
          }
        })
        .catch((err) => {
          console.error('Error during auth check:', err);
        });
    }
  }, []);

  const value = {
    isLoggedin,
    setIsLogged,   // ✅ Expose setter
    isAdmin,
    setIsAdmin,    // ✅ Expose setter
    employee,
    setEmployee,   // ✅ Expose setter
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
