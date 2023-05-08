require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
let path = require("path");
let passport = require("passport");
const session = require("express-session");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//connectDB
const connectDB = require("./db/connect");

//routers
const authorRouter = require("./routes/Authors.router");
const booksRouter = require("./routes/Books.router");
const userRouter = require("./routes/User.router");

//error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//View engine
app.set("public", path.join(__dirname, "public"));
app.set("view engine", "html");

app.use(express.static("./public"));

//Security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/books", booksRouter);
//app.use("/api/v1/books/authors", authorRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Port
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(
        `Successful connection! Server is listening on port ${port}...`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
