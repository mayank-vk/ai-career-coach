const express = require('express')
const router = express.Router()

const { loginControl } = require('../controllers/authController')
const { authControl } = require('../controllers/authController')

router.post('/signup',authControl)
router.post('/login',loginControl)


module.exports =  router


