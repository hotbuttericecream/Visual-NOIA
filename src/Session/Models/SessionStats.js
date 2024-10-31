/*
	This is used to track cool session stats
*/

const { Schema, model } = require("mongoose");

///

const schema = new Schema({
	GuildID: {
		type: String,
		required: true,
	},

	NormalSessionNumber: {
		type: Number,
		required: true,
	},

	DetourSessionNumber: {
		type: Number,
		required: true,
	},

	SpecialSessionNumber: {
		type: Number,
		required: true,
	},
});

module.exports = model("SessionStats", schema);