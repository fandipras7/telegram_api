const express = require('express')
const router = express.Router()
const { list, detailUser } = require('../controller/user')
const { protect } = require('../middleware/auth')

router
 .get('/listUser', protect, list)
 .get('/:id', protect, detailUser)

 module.exports = router