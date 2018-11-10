var mongoose = require("mongoose");

var inventorySchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	item: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Music"
		}
	]
});

var Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;