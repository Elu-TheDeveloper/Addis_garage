const express = require('express')

//call router method from express
const router =express.Router()

//import the install controller

const installController =require('../controllers/install.controller')
//create a route to handle install

router.get('/install',installController.install)

module.exports = router;