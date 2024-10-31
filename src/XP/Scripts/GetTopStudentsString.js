/*
	This will give you a list, in string, of the top people in XP
*/

const RankEnum = require("../Enums/Rank");
const GetRankIndexFromXP = require("../Utility/GetRankIndexFromXP");
const GetRankXPProgress = require("../Utility/GetRankXPProgress");
const GetRankEmojiAsMessage = require("../Utility/GetRankEmojiAsMessage");
const LeaderboardEnum = require("../Enums/Leaderboard");

///

module.exports = async (guild, leaderboard) => {
	const notablePlacementEmojis = [
		":first_place:",
		":second_place:",
		":third_place:",
		":four:",
		":five:",
		":six:",
		":seven:",
		":eight:",
		":nine:",
	];

	let topStudentsString = "";

	for (let index = 0; index < LeaderboardEnum.Length; index++) {
		const xpProfile = leaderboard.at(index);
		const placement = index + 1;
		const placementText = notablePlacementEmojis.at(index) || `\`${placement}\``;

		//

		const AddEmptyEntry = () => {
			const emptyRankEmoji = GetRankEmojiAsMessage(0);

			if (!xpProfile) {
				topStudentsString = topStudentsString.concat(`${placementText}: **[VAZIO]** - *??? XP (0/0)* ${emptyRankEmoji} \n`);
			}
		};

		if (!xpProfile) {
			AddEmptyEntry();
			continue;
		}

		//

		const GetDisplayName = async () => {
			let displayName;

			try {
				let member = await guild.members.cache.get(xpProfile.UserID);

				if (!member) {
					member = await guild.members.fetch(xpProfile.UserID);
				}

				displayName = member.displayName;
			} catch (error) {
				displayName = `[:grey_question: ID: <${xpProfile.UserID}>]`;
			}

			return displayName;
		};

		const displayName = await GetDisplayName();

		const AddEntry = () => {
			const xp = xpProfile.Total;
			const rankIndex = GetRankIndexFromXP(xp);
			const rankProgress = GetRankXPProgress(xp);
			const requirementOfNextRank = RankEnum.XPRequirement.at(rankIndex + 1) || "MAX";
			const rankEmoji = GetRankEmojiAsMessage(rankIndex);

			topStudentsString = topStudentsString.concat(
				`${placementText}: **${displayName}** - *${xp} XP (${rankProgress}/${requirementOfNextRank})*  ${rankEmoji} \n`
			);
		};

		AddEntry();
	}

	//

	return topStudentsString;
};
