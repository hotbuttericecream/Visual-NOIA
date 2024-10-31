/*
	This applies XP and increments the attendance number of students 
*/

const SessionEnum = require("../Enums/Session");
const GetRankIndexFromXP = require("../../XP/Utility/GetRankIndexFromXP");
const GetOrCreateXPProfile = require("../../XP/Utility/GetOrCreateXPProfile");

///

module.exports = async (guildID, student, hoursSpent, sessionType, xpPerHour) => {
	const xpProfile = await GetOrCreateXPProfile(guildID, student.UserID);

	//

	const gain = Math.floor(xpPerHour * hoursSpent);
	const hasRankedUp = GetRankIndexFromXP(xpProfile.Total) !== GetRankIndexFromXP(xpProfile.Total + gain);

	const UpdateXPStats = () => {
		xpProfile.Total += gain;
	};

	UpdateXPStats();

	await xpProfile.save();

	//

	const UpdateSessionStats = () => {
		student.TotalHoursInSessions += hoursSpent;

		if (sessionType === SessionEnum.SessionType.Normal) {
			student.TimesPresentInNormalSessions += 1;
		} else if (sessionType === SessionEnum.SessionType.Detour) {
			student.TimesPresentInDetourSessions += 1;
		} else if (sessionType === SessionEnum.SessionType.Special) {
			student.TimesPresentInSpecialSessions += 1;
		}
	};

	UpdateSessionStats();

	await student.save();

	//

	return [xpProfile.Total, gain, hasRankedUp];
};
