var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	admin: Boolean,
	cart:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Music"
		}
	]
});
UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);
module.exports = User;