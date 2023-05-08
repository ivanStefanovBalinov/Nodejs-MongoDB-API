const express = require("express");
const router = express.Router();
const { authJWT, userData } = require("../middleware/authentication");

const {
  signIn,
  authenticateUserPassportLocal,
  authenticateWithFaceBook,
} = require("../controllers/User.auth.controller");

router.post("/signIn", signIn);
router.post("/login", authenticateUserPassportLocal);
router.get("/login/facebook", authenticateWithFaceBook);
router.get("/userProfile", authJWT, userData);

module.exports = router;
