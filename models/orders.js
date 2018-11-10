var mongoose = require("mongoose");

var ordersSchema = new mongoose.Schema({
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

var Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;