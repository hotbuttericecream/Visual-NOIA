/*
	This gives you how far in XP you're in a rank. This also accounts for XP progress resetting upon reaching 
	a new rank
*/

const RankEnum = require("../Enums/Rank");
const GetRankIndexFromXP = require("./GetRankIndexFromXP");

///

module.exports = (xp) => {
	const rankIndex = GetRankIndexFromXP(xp);

	let sumOfPreviousRankRequirements = 0;

	for (const [index, requirement] of RankEnum.XPRequirement.entries()) {
		if (index === rankIndex + 1) {
			break;
		}

		sumOfPreviousRankRequirements += requirement;
	}

	const progress = xp - sumOfPreviousRankRequirements;

	return progress;
};
