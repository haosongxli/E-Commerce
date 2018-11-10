var mongoose = require("mongoose");

var musicSchema = new mongoose.Schema({
	musicname: String,
	price: Number,
	cover: String,
	style: String,
	artist: String,
	review: String,
	avaliable: Boolean,
	inventory: Number
});

var Music = mongoose.model("Music", musicSchema);
module.exports = Music;