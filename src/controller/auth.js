const createError = require('http-errors')
const errMessage = createError.InternalServerError()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { generateToken, generateRefreshToken } = require('../helper/auth')
const { checkEmail, addDataRegister } = require('../model/auth')
const commonHelper = require('../helper/common')

const register = async (req, res, next) => {
    try {
      const { name, email, password, avatar } = req.body
      const { rowCount } = await checkEmail(email)
      if (rowCount) {
        return next(createError(403, 'User sudah terdaftar'))
      }
      const salt = bcrypt.genSaltSync(10)
      const hashPassword = bcrypt.hashSync(password, salt)
      const dataRegister = {
        id: uuidv4(),
        name,
        email,
        password: hashPassword,
        avatar: 'default.png'
      }
      await addDataRegister(dataRegister)
      delete dataRegister.password
    //   sendEmail(email)
      commonHelper.response(res, dataRegister, 201, 'User berhasil ditambahkan')
    } catch (error) {
      console.log(error)
      next(createError('Internal Server Error'))
    }
  }

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { rows: [user] } = await checkEmail(email)
      if (!user) {
        return commonHelper.response(res, null, 403, 'email atau password anda salah')
      }
      const checkPassword = bcrypt.compareSync(password, user.password)
      if (!checkPassword) {
        return commonHelper.response(res, null, 403, 'email atau password anda salah')
      }
      delete user.password
      const payload = {
        email: user.email,
        id: user.id
      }
      user.token = generateToken(payload)
      user.refreshToken = generateRefreshToken(payload)
      commonHelper.response(res, user, 201, 'Anda berhasil Login')
    } catch (error) {
      console.log(error)
      next(new createError.InternalServerError())
    }
  }

  module.exports = {register, login}