/*
	This creates a pretty embed out of the 'topStudentsString'
*/

const { EmbedBuilder } = require("discord.js");
const LeaderboardEnum = require("../Enums/Leaderboard");

///

module.exports = (topStudentsString) => {
	const embed = new EmbedBuilder();

	embed.setTitle(`**Top ${LeaderboardEnum.Length} XP**`);
	embed.setDescription(topStudentsString);
	embed.setImage("https://i.imgur.com/NXaXRzR.png");

	return embed;
};
