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

	UserID: {
		type: String,
		required: true,
	},

	//  If this user is an alt account, apply session XP to this user instead
	AltAccountOfUserID: {
		type: String,
	},

	TimesPresentInNormalSessions: {
		type: Number,
		required: true,
	},

	TimesPresentInDetourSessions: {
		type: Number,
		required: true,
	},

	TimesPresentInSpecialSessions: {
		type: Number,
		required: true,
	},

	TotalHoursInSessions: {
		type: Number,
		required: true,
	},
});

module.exports = model("Student", schema);
