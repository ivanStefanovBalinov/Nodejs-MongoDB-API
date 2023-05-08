const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/Books.controller");

router.route("/").post(addBook).get(getAllBooks);
router.route("/:id").get(getSingleBook).delete(deleteBook).put(updateBook);

module.exports = router;
