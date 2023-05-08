const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const lodash = require("lodash");
const { StatusCodes } = require("http-status-codes");

const authJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const userData = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, msg: "User Not Found" });
    }
    res.status(StatusCodes.OK).json({
      status: true,
      user: lodash.pick(user, ["userName", "email", "favoriteBooks"]),
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

module.exports = { authJWT, userData };
