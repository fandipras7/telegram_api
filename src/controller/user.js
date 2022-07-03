const createError = require("http-errors");
const errMessage = createError.InternalServerError();
const commonHelper = require("../helper/common");
const { detailChat } = require("../model/chat");
const userModel = require("../model/user");

const list = async (req, res, next) => {
  try {
    const id = req.user.id;
    let { search, limit } = req.query;

    search = search || "";
    limit = Number(limit) || 5;

    const result = await userModel.list(search, limit);

    if (!result.rowCount) {
      next(createError("Data Not Found"));
    }

    const data = await Promise.all(
      result.rows.map(async (item) => {
        const chat = await detailChat(item.id, id);

        const listChat = {
          user: item,
          message: chat.rows,
        };

        return listChat;
      })
    );

    commonHelper.response(res, data, 200, "Success get all user data");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

const detailUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {rows: result} = await userModel.findBy("id", id);
    const data = result[0]

    if (!data) {
      next(createError("Data Not Found"));
    }
    // console.log(data);
    delete data.password
    commonHelper.response(res, data, 200, "get detail users");
  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  
  }
};

module.exports = { list, detailUser };
