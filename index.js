require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const createError = require("http-errors");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const xss = require("xss-clean");
const jwt = require("jsonwebtoken");
const mainRoute = require("./src/routes/index");
const listenSocket = require("./src/socket/index");

const app = express();
const http = require("http");
const { updateOnlineStatus } = require("./src/model/user");
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://master--precious-pika-9e595f.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))

// sanitize
app.use(xss());

// route
app.use("/v1", mainRoute);

app.use("/img", express.static(path.join(__dirname, "/upload")));

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://master--precious-pika-9e595f.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  // console.log(token);
  jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
    if (error) {
      if (error && error.name === "JsonWebTokenError") {
        next(createError(400, "token invalid"));
      } else if (error && error.name === "TokenExpiredError") {
        next(createError(400, "token expired"));
      } else {
        next(createError(400, "Token not active"));
      }
      // console.log("setelah next jalan kaga nih");
    }
    socket.userId = decoded.id;
    socket.join(decoded.id);
    const data = {
      isOnline: 1,
      id: decoded.id,
      updatedAt: new Date(Date.now()),
    };
    updateOnlineStatus(data);
    next();
  });
});

io.on("connection", (socket) => {
  // console.log("Client Connected");
  let i = 1;
  console.log(`ada perankat yg terhubung dengan id ${socket.id} dan id usernya ${socket.userId}`);
  listenSocket(io, socket);
});

app.use((err, req, res, next) => {
  let messError = err.message || "Internal Server Error";
  // if (err.message === 'File too large') {
  //   messError = 'Maximale size 2 mb'
  // }
  // if (err.message === 'Cannot read property \'filename\' of undefined') {
  //   console.log(err)
  // }
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: messError,
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
