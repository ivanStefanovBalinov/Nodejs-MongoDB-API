const Books = require("../models/Books.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

//Add Book
const addBook = async (req, res) => {
  const book = await Books.create(req.body);
  if (!book) {
    throw new BadRequestError("Please follow the model structure.");
  } else {
    res.status(StatusCodes.CREATED).json({ book });
  }
};

//GET all books
const getAllBooks = async (req, res) => {
  const { title, author, sort, numericFilters } = req.query;
  const queryObject = {};

  if (author) {
    queryObject.author = author;
  }

  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Books.find(queryObject);

  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("releaseDate");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const books = await result;
  const discountedBooks = books.forEach((book) => book.discountBooks());

  if (!books) {
    throw new NotFoundError("Something went wrong. Please try again.");
  } else {
    res
      .status(StatusCodes.OK)
      .json({ books, discountedBooks, nbHits: books.length });
  }
};

//GET Single Book
const getSingleBook = async (req, res) => {
  const {
    params: { id: bookId },
  } = req;

  const book = await Books.findOne({ _id: bookId });
  if (!book) {
    throw new NotFoundError(`Book with id ${bookId} was not found ...`);
  } else {
    res.status(StatusCodes.OK).json({ book });
  }
};

//PUT Update book
const updateBook = async (req, res) => {
  const {
    params: { id: bookId },
  } = req;

  const updatedBook = await Books.findByIdAndUpdate({ _id: bookId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    throw new NotFoundError(`Book with id ${bookId} was not found ...`);
  } else {
    res.status(StatusCodes.OK).json({ updatedBook });
  }
};

//DEL Delete Book
const deleteBook = async (req, res) => {
  const {
    params: { id: bookId },
  } = req;

  const bookToDelete = await Books.findByIdAndDelete({ _id: bookId });
  if (!bookToDelete) {
    throw new NotFoundError(`Book with id ${bookId} was not found ...`);
  } else {
    res.status(StatusCodes.OK).send("This book was successfully deleted");
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
};
