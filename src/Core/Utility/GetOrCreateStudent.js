/*
	This returns a student, taking into consideration if it's marked as an alt account
*/

const StudentSchema = require("../Models/Student");

///

const GetConsideringIfIsAlt = async (guildID, userID) => {
	let student = await StudentSchema.findOne({
		GuildID: guildID,
		UserID: userID,
	});

	const mainAccountID = student?.AltAccountOfUserID;

	if (mainAccountID) {
		student = await StudentSchema.findOne({
			GuildID: guildID,
			UserID: mainAccountID,
		});
	}

	if (!student) {
		student = new StudentSchema({
			GuildID: guildID,
			UserID: mainAccountID || userID,
			TimesPresentInNormalSessions: 0,
			TimesPresentInDetourSessions: 0,
			TimesPresentInSpecialSessions: 0,
			TotalHoursInSessions: 0,
		});
	}

	return student;
};

const GetRegardlessIfIsAlt = async (guildID, userID) => {
	let student = await StudentSchema.findOne({
		GuildID: guildID,
		UserID: userID,
	});

	if (!student) {
		student = new StudentSchema({
			GuildID: guildID,
			UserID: userID,
			TimesPresentInNormalSessions: 0,
			TimesPresentInDetourSessions: 0,
			TimesPresentInSpecialSessions: 0,
			TotalHoursInSessions: 0,
		});
	}

	return student;
};

//

module.exports = {
	ConsideringIfIsAlt: GetConsideringIfIsAlt,
	RegardlessIfIsAlt: GetRegardlessIfIsAlt,
};
