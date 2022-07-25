const { decodeBase64 } = require("bcryptjs");
const pool = require("../config/db");

module.exports = {
  // diambil pada saat get all user
  detailChat: (sender, receiver) =>
    new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM chats WHERE (sender='${sender}' AND receiver='${receiver}') 
        OR (sender='${receiver}' AND receiver='${sender}') ORDER BY created_at DESC LIMIT 1`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    }),

  findBy: (field, search) =>
    new Promise((resolve, reject) => {
      // console.log(search);
      pool.query(`SELECT * FROM chats WHERE ${field} = $1`, [search], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }),

  insertChat: ({ id, sender, receiver, type, chat, isRead }) =>
    new Promise((resolve, reject) => {
      pool.query(`INSERT INTO chats VALUES ($1, $2, $3, $4, $5, $6)`, [id, sender, receiver, type, chat, isRead], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }),

  listChat: (sender, receiver) =>
    new Promise((resolve, reject) => {
      // console.log("sek query");
      pool.query(
        `SELECT chats.id, userSender.id AS sender_id, userReceiver.id AS receiver_id,
      userSender.name AS sender, userReceiver.name AS receiver, chats.chat,
      userSender.avatar AS sender_Avatar, userReceiver.avatar AS receiver_avatar,
      chats.created_at FROM chats
      LEFT JOIN users AS userSender ON chats.sender = userSender.id
      LEFT JOIN users AS userReceiver ON chats.receiver = userReceiver.id
      WHERE (sender = '${sender}' AND receiver='${receiver}')
      OR (sender='${receiver}' AND receiver='${sender}')
      `,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    }),
  deleteChat: (id) =>
    new Promise((resolve, reject) => {
      pool.query("DELETE FROM chats WHERE id = $1", [id], (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    }),
};
