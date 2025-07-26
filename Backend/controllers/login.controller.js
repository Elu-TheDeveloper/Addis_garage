const loginService = require('../services/login.service');
const jwt = require("jsonwebtoken");
const { ERRORS } = require('../services/employee.service');
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

async function logIn(req, res) {
  try {
    console.log('Login request received:', {
      body: req.body,
      // headers: req.headers
    });

    // Handle both field naming conventions
    const email = req.body.employee_email || req.body.email;
    const password = req.body.employee_password || req.body.password;

    // Validate input
    if (!email?.trim() || !password?.trim()) {
      console.log('Validation failed - missing fields:', {
        email: !!email,
        password: !!password,
        rawBody: req.body
      });
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
        received_data: {
          body: req.body,
          headers: req.headers
        }
      });
    }

    // Process login
    const result = await loginService.logIn({ 
      employee_email: email.trim(), 
      employee_password: password.trim() 
    });

    if (result.status === "fail") {
      console.log('Login failed:', result.message);
      return res.status(result.statusCode || 401).json(result);
    }

    const { employee } = result;
    
    // Create JWT payload
    const payload = {
      employee_id: employee.employee_id,
      employee_email: employee.employee_email,
      employee_role: employee.company_role_id,
      employee_first_name: employee.employee_first_name,
      iss: process.env.APP_NAME || 'hr-system',
      aud: process.env.CLIENT_ID || 'web-client'
    };

    // Generate token
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h"
    });

    // Set secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Successful response
    console.log('Login successful for:', employee.employee_email);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        employee_token: token,
        employee_id: employee.employee_id,
        employee_email: employee.employee_email,
        employee_first_name: employee.employee_first_name
      }
    });

  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }
}

module.exports = {
  logIn
};