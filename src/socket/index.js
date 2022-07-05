const { v4: uuidv4 } = require("uuid");
const { insertChat, listChat, deleteChat } = require("../model/chat");

const listenSocket = (io, socket) => {
  // const id = socket.data.iduser
  // const data = `halo`;
  // socket.on("ping", (data) => {
  //   io.to("3e832e71-5fea-420c-a6bb-c2a961069c9e").emit("ping-response", data.message);
  // });
  socket.on("join-room", (data) => {
    // console.log(data.id + " selamat join dengan diri sendiri");
    socket.join(data.id);
  });
  socket.on("send-message", async (data) => {
    const { sender, receiver, type, message } = data;
    const setData = {
      id: uuidv4(),
      sender,
      receiver,
      type,
      message,
      isRead: 1,
    };
    insertChat(setData)
      .then(async () => {
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
  socket.on("delete-message", (id, sender, receiver) => {
    deleteChat(id)
      .then(async () => {
        const listChats = await listChat(sender, message);
        io.to(sender).emit("send-mesage-response", listChats.rows);
        io.to(receiver).emit("send-message-response", listChats.rows);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};

module.exports = listenSocket;
