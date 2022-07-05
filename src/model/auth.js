const pool = require("../config/db");

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

const addDataRegister = ({ id, name, email, username, password, avatar }) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO users(id, name, username, email, password, avatar)VALUES($1, $2, $3, $4, $5, $6)", [id, name, username, email, password, avatar], (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = { checkEmail, addDataRegister };
