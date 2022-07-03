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

  updateUser: (data) =>
    new Promise((resolve, reject) => {
      const { name, username, phone, bio, updatedAt } = data;
      pool.query(`UPDATE users SET name = $1, username = $2, phone = $3, bio = $4, updated_at = $5`, [name, username, phone, bio, updatedAt], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }),

  updateImage: (data, id) =>
    new Promise((resolve, reject) => {
      const { avatar, updatedAt } = data;
      pool.query(`UPDATE users SET avatar = $1, updated_at = $2 where id = $3`, [avatar, updatedAt, id], (err, result) => {
        if(!err) {
          const updateDate = {
            id,
            ...data
          }
          resolve(updateDate)
        } else {
          reject(err)
        }
      });
    }),
};
