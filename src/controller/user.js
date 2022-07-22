const createError = require("http-errors");
const errMessage = createError.InternalServerError();
const commonHelper = require("../helper/common");
const deleteFile = require("../helper/deleteFile");
const { detailChat, listChat } = require("../model/chat");
const user = require("../model/user");
const userModel = require("../model/user");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const list = async (req, res, next) => {
  try {
    // console.log("apakah get list jalan");
    const id = req.user.id;
    let { search, limit } = req.query;

    search = search || "";
    limit = Number(limit) || 5;

    const result = await userModel.list(search, limit);

    if (!result.rowCount) {
      // console.log("apakah ini jalan");
      return next(createError("Data Not Found"));
    }

    const data = await Promise.all(
      result.rows.map(async (item) => {
        const chat = await detailChat(item.id, id);

        const listChat = {
          user: item,
          message: chat.rows,
        };

        return { ...listChat };
      })
    );
    // console.log(data[0].user);
    // console.log("apakah get list jalan");

    commonHelper.response(res, data, 200, "Success get all user data");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

const detailUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: result } = await userModel.findBy("id", id);
    if (!result) {
      next(createError("Data Not Found"));
    }
    const data = result[0];

    // console.log(data);
    delete data.password;
    commonHelper.response(res, data, 200, "get detail users");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

const profile = async (req, res, next) => {
  try {
    const id = req.user.id;
    //   console.log('apakah ini jalan');
    const { rows: result } = await userModel.findBy("id", id);
    if (!result) {
      next(createError("Data Not Found"));
    }
    const data = result[0];

    // console.log(data);
    delete data.password;
    commonHelper.response(res, data, 200, "get detail profile");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await userModel.findBy("id", id);

    if (!user.rowCount) {
      next(createError("Data Not Found"));
    }

    const data = {
      ...req.body,
      updatedAt: new Date(Date.now()),
      id: id,
    };

    const result = await userModel.updateUser(data);

    commonHelper.response(res, data, 200, "Your data has been updated");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

const updateImage = async (req, res, next) => {
  try {
    const id = req.user.id;
    // const user = await userModel.findBy("id", id);

    // if (!user.rowCount) {
    //   if (req.file) {
    //     deleteFile(`http://${req.get("host")}/img/${req.file.filename}`);
    //   }
    //   next(createError(`User with id ${id} not found`));
    // }

    // let { avatar } = user.rows[0];
    // if (req.file) {
    //   if (avatar !== "default.png") {
    //     deleteFile(`http://${req.get("host")}/img/${avatar}`);
    //   }
    //   // avatar = req.file.filename;
    //   avatar = `http://${req.get("host")}/img/${req.file.filename}`;
    // }

    const avaFile = req.file;
    // console.log(req.file);
    const avatar = await cloudinary.uploader.upload(avaFile.path, { folder: "telegram/avatar" });

    console.log(avatar);
    console.log("apakah ini jalan");

    const data = {
      avatar: avatar.secure_url,
      updatedAt: new Date(Date.now()),
    };

    const result = await userModel.updateImage(data, id);

    commonHelper.response(res, result, 200, "update imgae success");
  } catch (error) {
    // deleteFile(`http://${req.get("host")}/img/${req.file.filename}`);
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

module.exports = { list, detailUser, profile, updateUser, updateImage };
