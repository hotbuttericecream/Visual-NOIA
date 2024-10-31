/*
	This gives you a rank's emoji formatted to work as a discord message
*/

const RankEnum = require("../Enums/Rank");

///

module.exports = (rankIndex) => {
	const rankEmoji = RankEnum.Emoji.at(rankIndex);
	const message = `<:${rankEmoji.Name}:${rankEmoji.ID}>`;

	return message;
};
