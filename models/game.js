const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileSize: { type: Number, required: true },
  released: Boolean,
  genre: String,
  image: String
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
