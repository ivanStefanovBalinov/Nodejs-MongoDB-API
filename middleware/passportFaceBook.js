const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User.model");
require("dotenv").config({ path: "../.env" });

const facebookPassport = passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.find({
        _id: profile.id,
        provider: "facebook",
      });
      if (!user) {
        console.log("Adding new facebook user to DataBase");
        const user = new User({
          name: profile.displayName,
          email: profile.email,
          provider: profile.provider,
        });
        await user.save();
        // console.log(user);
        return cb(null, profile);
      } else {
        console.log("Facebook User already exist in DataBase");
        // console.log(profile);
        return cb(null, profile);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = facebookPassport;
