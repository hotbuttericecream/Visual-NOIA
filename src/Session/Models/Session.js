/*
	This is used to save temporary info about a session. Why not use some cache instead of a database??
	IDK JAVASCRIPT
*/

const { Schema, model } = require("mongoose");

///

const schema = new Schema({
	GuildID: {
		type: String,
		required: true,
	},

	VoiceChannelID: {
		type: String,
		required: true,
	},

	SessionType: {
		type: String,
		required: true,
	},

	XpPerHour: {
		type: Number,
		required: true,
	},

	/* 
		Attendees: [AttendeeUserID]
	*/
	Attendees: {
		type: Array,
		required: true,
	},

	/* 
		AttendeesWorkloads: {
			[AttendeeUserID]: {
				{JoinTimestamp: Date.now(), LeaveTimestamp: Date.now()},
				{JoinTimestamp: Date.now(), LeaveTimestamp: null},
			}
		}
	*/
	AttendeesWorkloads: {
		type: Map,
		required: true,
	},

	StartTimestamp: {
		type: Number,
		required: true,
	},
});

module.exports = model("Session", schema);
