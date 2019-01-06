const express = require('express');
const authRoutes = require('./routes/auth-route');
const passportSetup = require('./config/passport-setup');
var mysql = require('mysql');
const con = require('./db');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const profileRoutes = require('./routes/profile-route');

const app = express();

app.set("view engine", "ejs");

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/assets",express.static("assets"));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req,res) => {
  res.redirect("/auth/login");
  //res.render("home", {user: req.user});
});

app.listen(3000, () => {
  console.log("listening for port 3000....");
});
