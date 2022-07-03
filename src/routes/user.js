const express = require('express')
const router = express.Router()
const { list, detailUser, updateUser, profile } = require('../controller/user')
const { protect } = require('../middleware/auth')

router
 .get('/listUser', protect, list)
 .get('/profile', protect, profile)
 .get('/:id', protect, detailUser)
 .post('/', protect, updateUser)

 module.exports = router