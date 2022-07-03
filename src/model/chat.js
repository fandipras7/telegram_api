const pool = require("../config/db");

module.exports = {
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
};
