/*
	This will give you the XP's database sorted and sliced to include only the top
*/

const XPSchema = require("../../XP/Models/XP");
const LeaderboardEnum = require("../Enums/Leaderboard");

///

module.exports = async () => {
	const xpProfilesInDecrescentOrder = await XPSchema.find().sort({ Total: -1 });
	const leaderboard = xpProfilesInDecrescentOrder.slice(0, LeaderboardEnum.Length);

	return [leaderboard, xpProfilesInDecrescentOrder];
};
