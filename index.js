require('dotenv').config()
const express = require("express");
const { Server } = require("socket.io");
const createError = require('http-errors')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const xss = require('xss-clean')
const mainRoute = require('./src/routes/index')


const app = express();
const http = require("http");
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
);

// app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))

// sanitize
app.use(xss())

// route
app.use('/v1', mainRoute)

app.use('/img', express.static(path.join(__dirname, '/upload')))

app.all('*', (req, res, next) => {
    next(new createError.NotFound())
  })

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use((err, req, res, next) => {
    let messError = err.message || 'Internal Server Error'
    // if (err.message === 'File too large') {
    //   messError = 'Maximale size 2 mb'
    // }
    // if (err.message === 'Cannot read property \'filename\' of undefined') {
    //   console.log(err)
    // }
    const statusCode = err.status || 500
    res.status(statusCode).json({
      message: messError
    })
  })



httpServer.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
