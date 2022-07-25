const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

// const multerUpload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "./upload");
//     },
//     filename: (req, file, cb) => {
//       const extension = path.extname(file.originalname);
//       const filename = `${Date.now()}${extension}`;
//       cb(null, filename);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const extension = path.extname(file.originalname);
//     const fileSize = parseInt(req.header["content-length"]);
//     const maxSize = 2 * 1024 * 1024;
//     if (fileSize > maxSize) {
//       const error = {
//         message: "FIle size exceeds 2 MB",
//       };
//       return cb(error, false);
//     }

//     if (extension === ".jpg" || extension === ".png") {
//       cb(null, true);
//     } else {
//       const error = {
//         message: "file must be jpg or png",
//       };
//       cb(error, false);
//     }
//   },
// });

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./upload");
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const filename = `${Date.now()}${extension}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileSize = parseInt(req.header["content-length"]);
    const maxSize = 2 * 1024 * 1024;
    if (fileSize > maxSize) {
      const error = {
        message: "FIle size exceeds 2 MB",
      };
      return cb(error, false);
    }

    if (extension === ".jpg" || extension === ".png") {
      cb(null, true);
    } else {
      const error = {
        message: "file must be jpg or png",
      };
      cb(error, false);
    }
  },
});

const uploadAva = (req, res, next) => {
  const multerSingle = multerUpload.array("avatar");
  multerSingle(req, res, (err) => {
    if (!err) {
      next();
    } else {
      next(createError(err.message));
    }
  });
};

module.exports = uploadAva;
