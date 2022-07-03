const response = (res, result, status, message, pagination) => {
    const resultPrint = {}
    resultPrint.status = 'success'
    resultPrint.statusCode = status
    if (pagination) {
      resultPrint.pagination = pagination
    }
    resultPrint.data = result
    resultPrint.message = message || null
  
    res.status(status).json(resultPrint)
  }
  
  module.exports = {
    response
  }
  