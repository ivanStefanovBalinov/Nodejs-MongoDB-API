const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const passport = require("../middleware/passportConfig");
const facebookPassport = require("../middleware/passportFaceBook");

//Register new user
const signIn = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;
  //No need to check if user with email exist, because email is set to be unique in the User model.
  if (!userName || !email || !password || !confirmPassword) {
    throw new BadRequestError("Please Fill all Fields!");
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Password do not match!");
  }
  const newUser = await User.create({ ...req.body });
  const token = newUser.createJWT();
  if (!newUser) {
    res
      .status(StatusCodes.EXPECTATION_FAILED)
      .send("Registration Failed. Please try again...");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: newUser.userName }, token });
};

//Login
//Local Strategy
const authenticateUserPassportLocal = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(400).send(err);
    } else if (user) {
      return res
        .status(StatusCodes.OK)
        .json({ token: user.createJWT(), msg: "Successfully Logged In" });
    } else {
      return res.status(404).json(info);
    }
  })(req, res, next);
};

//Facebook Strategy
const authenticateWithFaceBook = (req, res, next) => {
  facebookPassport.authenticate("facebook", (err, user, info) => {
    if (err) {
      return res.status(400).send(err);
    } else if (user) {
      return res.status(StatusCodes.OK).json({
        token: user.createJWT(),
        msg: "Successfully Logged with Facebook",
      });
    } else {
      return res.status(404).json(info);
    }
  })(req, res, next);
};

module.exports = {
  signIn,
  authenticateUserPassportLocal,
  authenticateWithFaceBook,
};
