const mongoose = require("mongoose");

const BooksScheme = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
  },
  author: {
    type: String,
    required: [true, "Book author is required"],
  },
  genre: {
    type: String,
    required: [true, "Book genre is required"],
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    default: 0,
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  releaseDate: {
    type: Number,
    default: 2023,
  },
  img: {
    type: String,
    require: [true, "Please Provide cover image"],
  },
  dateOfSale: {
    type: Number,
    default: 0,
  },
});

BooksScheme.methods.discountBooks = function () {
  if (this.quantity <= 3) {
    return (this.price = this.price * 0.5);
  }
};

let Books = mongoose.model("Books", BooksScheme);

module.exports = Books;
