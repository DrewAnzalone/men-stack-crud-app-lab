const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const print = console.log;
const Game = require("./models/game");
const URI = process.env.MONGODB_URI;

const app = express();
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(URI);
mongoose.connection.on("connected", () => print(`Connected to MongoDB ${mongoose.connection.name}.`));

// GET routes
app.get("/", (req, res) => {
  res.render("index.ejs");
})


app.listen(3000, () => print('Listening on port 3000'));
