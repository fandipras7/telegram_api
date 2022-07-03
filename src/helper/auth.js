const jwt = require('jsonwebtoken')
const generateToken = (payload) => {
  const verivyOption = {
    expiresIn: '24H'
    // issuer: 'tokoku'
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, verivyOption)
  return token
}

const generateRefreshToken = (payload) => {
  const verivyOption = { expiresIn: '1 day' }
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN, verivyOption)
  return token
}

module.exports = { generateToken, generateRefreshToken }
