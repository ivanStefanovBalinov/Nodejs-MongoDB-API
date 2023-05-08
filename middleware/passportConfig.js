const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) console.log(err);
          if (!isMatch) res.send("Incorrect password");
          return done(null, user);
        });
      })
      .catch((err) => console.log(err));
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
