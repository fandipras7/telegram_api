const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const protect = (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      console.log(decoded)
      req.user = decoded
      next()
    } else if (req.params.token && req.method === 'GET') {
      console.log(req)
      token = req.params.token
      const decoded = jwt.verify(token, 'errrooo')
      req.user = decoded
      next()
    } else {
      next(createError(400, 'Server need token'))
    }
  } catch (error) {
    console.log(error)
    if (error && error.name === 'JsonWebTokenError') {
      next(createError(400, 'Token Invalid'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(createError(400, 'Token Expired'))
    } else {
      next(createError(400, 'Token not active'))
    }
  }
}

module.exports = { protect }
