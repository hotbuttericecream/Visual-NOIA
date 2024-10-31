/*
	This is used to save server-configured info
*/

const { Schema, model } = require("mongoose");

///

const schema = new Schema({
	GuildID: {
		type: String,
		required: true,
	},

	ReportChannelID: {
		type: String,
		required: true,
	},

	PostSessionLeaderboardChannelID: {
		type: String,
		required: true,
	},

	OrganizerRoleID: {
		type: String,
		required: true,
	},
});

module.exports = model("Settings", schema);
