const express = require('express')
const router = express.Router()
const authRoute = require('./auth')
const userRoute = require('./user')


router
 .use('/auth', authRoute)
 .use('/users', userRoute)

 module.exports = router