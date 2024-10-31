/*
	This returns an XP profile
*/

const XPSchema = require("../Models/XP");

///

module.exports = async (guildID, userID) => {
	let xpProfile = await XPSchema.findOne({
		GuildID: guildID,
		UserID: userID,
	});

	if (!xpProfile) {
		xpProfile = new XPSchema({
			GuildID: guildID,
			UserID: userID,
			Total: 0,
		});
	}

	return xpProfile;
};
