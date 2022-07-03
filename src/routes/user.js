const express = require('express')
const router = express.Router()
const { list, detailUser, updateUser, profile, updateImage } = require('../controller/user')
const { protect } = require('../middleware/auth')
const uploadAva = require('../middleware/upload')
// const upload = require('../middleware/upload')

router
 .get('/listUser', protect, list)
 .get('/profile', protect, profile)
 .get('/:id', protect, detailUser)
 .post('/', protect, updateUser)
 .post('/profile', protect, uploadAva, updateImage)

 module.exports = router