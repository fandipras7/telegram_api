const fs = require("fs");

const deleteFile = (filepath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      fs.unlink(filepath, (err) => {
        if (err) reject(new Error("Error delete file"));
        resolve();
      });
    }
  });
};

module.exports = deleteFile;
