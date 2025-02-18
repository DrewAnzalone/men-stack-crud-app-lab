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

//* GET routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/games", async (req, res) => {
  const allGames = await Game.find();
  res.render("games/index.ejs", { games: allGames });
});

app.get("/games/new", (req, res) => {
  res.render("games/new.ejs");
});

app.get("/games/:id/edit", async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.render("games/edit.ejs", { game });
});

app.get("/games/:id", async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.render("games/show.ejs", { game });
});

//* POST routes
app.post("/games", async (req, res) => {
  req.body.released = req.body.released === "on";
  req.body.image = await checkImage(req.body.image) ? req.body.image : "";
  print(req.body.image);
  const game = await Game.create(req.body);
  res.render("games/show.ejs", { game });
});

//* PUT routes
app.put("/games/:id", async (req, res) => {
  req.body.released = req.body.released === "on";
  req.body.image = await checkImage(req.body.image) ? req.body.image : "";
  print(req.body.image);
  await Game.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/games/${req.params.id}`);
})

//* DELETE routes
app.delete("/games/:id", async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.redirect("/games");
});

//* helper method
// source https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
async function checkImage(url) {
  try {
    const res = await fetch(url);
    const buff = await res.blob();
  
    return buff.type.startsWith('image/');
  } catch (error) {
    return false;
  }
}


app.listen(3000, () => print('Listening on port 3000'));
