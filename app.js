//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose
  .connect("mongodb://127.0.0.1:27017/qppDB", { useNewUrlParser: true })
  .then(() => console.log("connected"))
  .catch((err) => {
    console.error(err);
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "ppppp.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const people = new mongoose.model("people", userSchema);

app.get("/", function (req, res) {
  res.render("aboutus");
});

app.get("/aboutus", function (req, res) {
  res.render("aboutus");
});

app.get("/contactus", function (req, res) {
  res.render("contactus");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/nftmap", function (req, res) {
  res.render("nftmap");
});

app.post("/register", function (req, res) {
  const newUser = new people({
    email: req.body.username,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => {
      res.render("index");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/userlogin", function (req, res) {
  res.render("userlogin");
});

app.post("/userlogin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  people
    .findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("index");
        }
      }
    })
    .catch((err) => {
      //When there are errors We handle them here

      console.log(err);
      res.send(400, "Bad Request");
    });
});

app.listen(2000, function () {
  console.log("Server started on port 3000");
});
