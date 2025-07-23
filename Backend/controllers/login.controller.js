const loginService = require('../services/login.service');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

async function logIn(req, res, next) {
  try {
    const employeeData = {
      employee_email: req.body.employee_email || req.body.email,
      employee_password: req.body.employee_password || req.body.password
    };

    console.log('Normalized employeeData:', employeeData);

    const employee = await loginService.logIn(employeeData);

    if (employee.status === 'fail') {
      return res.status(403).json({
        status: employee.status,
        message: employee.message
      });
    }

    console.log('JWT Secret:', jwtSecret);
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined!');
    }

    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_role: employee.data.company_role_id,
      employee_first_name: employee.data.employee_first_name
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    res.status(200).json({
      status: 'success',
      message: 'Employee logged in successfully',
      data: { employee_token: token }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error'
    });
  }
}

module.exports = { logIn };
