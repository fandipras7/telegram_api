const pool = require("../config/db");

module.exports = {
  list: (search, limit) =>
    new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM users WHERE username ILIKE ('%${search}%') LIMIT $1`, [limit], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }),

  findBy: (field, search) =>
    new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM users WHERE ${field} = $1`, [search], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }),
};
