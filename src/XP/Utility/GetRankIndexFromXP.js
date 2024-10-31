/*
	This gives you what rank corresponds to an amount of XP. Keep in mind this accounts for your XP progress
	resetting upon reaching another rank
*/

const RankEnum = require("../Enums/Rank");

///

module.exports = (xp) => {
	let rankIndex = 0;
	let remainingXP = xp;

	for (const [index, requirement] of RankEnum.XPRequirement.entries()) {
		remainingXP -= requirement;

		const nextRequirement = RankEnum.XPRequirement.at(index + 1);

		if (remainingXP >= nextRequirement) {
			continue;
		}

		rankIndex = index;

		break;
	}

	return rankIndex;
};
