import React, { useState, useEffect, useContext } from 'react';
import EmployeeAuthHeader from '../utils/auth_headers';

const AuthContext = React.createContext(); 

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedin, setLogged] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [employee, setEmployee] = useState(null);

    const value = { isLoggedin, isAdmin, setAdmin, employee };

    useEffect(() => {
        const loggedInEmployee = EmployeeAuthHeader();
        if (loggedInEmployee && typeof loggedInEmployee.then === 'function') {
            loggedInEmployee.then((response) => {
                if (response?.employee_token) {
                    setLogged(true);
                    if (response.employee_role === 3) {
                        setAdmin(true);
                    }
                    setEmployee(response);
                }
            }).catch((err) => {
                console.error('Error during auth check:', err);
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
