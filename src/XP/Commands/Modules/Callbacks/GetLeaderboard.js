/*
	This is what's called to handle the command
*/

const GetLeaderboard = require("../../../Scripts/GetLeaderboard");
const GetTopStudentsString = require("../../../Scripts/GetTopStudentsString");
const GetLeaderboardEmbed = require("../../../Scripts/GetLeaderboardEmbed");

///

module.exports = async (client, interaction) => {
	await interaction.deferReply();

	const [leaderboard, xpProfilesInDecrescentOrder] = await GetLeaderboard();
	const topStudentsString = await GetTopStudentsString(interaction.guild, leaderboard);
	const leaderboardEmbed = GetLeaderboardEmbed(topStudentsString);

	//

	const GetCallerLeaderboardPositionFooter = () => {
		const callerMember = interaction.member;
		const callerIndex = xpProfilesInDecrescentOrder.findIndex((element) => element.UserID === callerMember.user.id);

		if (callerIndex === -1) {
			return `${callerMember.displayName}, você não tem nenhum XP!`;
		}

		return `${callerMember.displayName}, sua posição no placar é ${callerIndex + 1}`;
	};

	leaderboardEmbed.setFooter({
		text: GetCallerLeaderboardPositionFooter(),
	});

	//

	interaction.editReply({ embeds: [leaderboardEmbed] });
};
