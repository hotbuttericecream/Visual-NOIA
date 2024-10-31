/*
	This is used to save the amount of XP a user has
*/

const { Schema, model } = require("mongoose");

///

const schema = new Schema({
	GuildID: {
		type: String,
		required: true,
	},

	UserID: {
		type: String,
		required: true,
	},

	Total: {
		type: Number,
		required: true,
	},
});

module.exports = model("XPProfiles", schema);
