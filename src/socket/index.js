const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { insertChat, listChat, deleteChat } = require("../model/chat");

const listenSocket = (io, socket) => {
  // socket.on("join-room", (data) => {
  //   // console.log(data.id + " selamat join dengan diri sendiri");
  //   socket.join(data.id);
  // });
  socket.on("send-message", async (data) => {
    const { sender, receiver, type, chat } = data;
    const setData = {
      id: uuidv4(),
      sender,
      receiver,
      type: type || 0,
      chat,
      isRead: 1,
      created_at: moment(new Date()).format("LT"),
      // created_at: new Date(),
    };
    // console.log("apakah ini jalan");
    // console.log(sender);
    // console.log(receiver);
    insertChat(setData)
      .then(async () => {
        // console.log(receiver);
        // console.log(sender);
        const listChats = await listChat(sender, receiver);
        io.to(receiver).emit("send-message-response", listChats.rows);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  socket.on("chat-history", async (data) => {
    const { sender, receiver } = data;
    const listChats = await listChat(sender, receiver);
    io.to(sender).emit("send-message-response", listChats.rows);
  });
  socket.on("delete-message", ({ id, sender, receiver }) => {
    console.log("cek apakah delete jalan");
    // console.log(receiver);
    // console.log(sender);
    deleteChat(id)
      .then(async () => {
        const listChats = await listChat(sender, receiver);
        // io.to(sender).emit("send-mesage-response", listChats.rows);
        io.to(receiver).emit("send-message-response", listChats.rows);
        console.log("apakah delete sukses");
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};

module.exports = listenSocket;
