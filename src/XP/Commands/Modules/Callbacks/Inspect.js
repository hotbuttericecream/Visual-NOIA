/*
	This is what's called to handle the command
*/

const moment = require("moment");
const { EmbedBuilder } = require("discord.js");
const InspectEnum = require("../Enums/Inspect");
const XPSchema = require("../../../Models/XP");
const StudentSchema = require("../../../../Core/Models/Student");
const SessionEnum = require("../../../../Session/Enums/Session");
const GetRankIndexFromXP = require("../../../Utility/GetRankIndexFromXP");
const GetRankXPProgress = require("../../../Utility/GetRankXPProgress");
const GetRankEmojiAsMessage = require("../../../Utility/GetRankEmojiAsMessage");
const RankEnum = require("../../../Enums/Rank");
const GetLeaderboard = require("../../../Scripts/GetLeaderboard");

///

module.exports = async (client, interaction) => {
	const guildID = interaction.guild.id;
	const target = interaction.options.get(InspectEnum.CommandOption.User);
	const targetUser = target.user;

	//

	const student = await StudentSchema.findOne({
		GuildID: guildID,
		UserID: targetUser.id,
	});

	if (!student) {
		interaction.reply({
			content: "**Erro:** essa pessoa não possui dados de estudante registrados",
			ephemeral: true,
		});

		return;
	}

	//

	const xpProfile = await XPSchema.findOne({
		GuildID: guildID,
		UserID: targetUser.id,
	});

	if (!xpProfile) {
		interaction.reply({
			content: "**Erro:** essa pessoa não possui dados de XP registrados",
			ephemeral: true,
		});

		return;
	}

	//

	const targetMember = target.member;

	const xp = xpProfile.Total;
	const rankIndex = GetRankIndexFromXP(xp);

	const GetXPField = async () => {
		const totalField = `- **TOTAL:** ${xp}`;

		const rankName = RankEnum.Name.at(rankIndex);
		const rankEmoji = GetRankEmojiAsMessage(rankIndex);
		const rankProgression = GetRankXPProgress(xp);
		const nextRankRequirement = RankEnum.XPRequirement.at(rankIndex + 1) || "MAX";
		const rankField = `- **RANK:** ${rankName} (${rankProgression}/${nextRankRequirement}) ${rankEmoji}`;

		const [leaderboard, xpProfilesInDecrescentOrder] = await GetLeaderboard();
		const leaderboardIndex = xpProfilesInDecrescentOrder.findIndex((element) => element.UserID === targetUser.id);
		const leaderboardField = `- **PLACAR:** #${leaderboardIndex + 1}`;

		const final = totalField.concat("\n", rankField, "\n", leaderboardField);

		return final;
	};

	const GetStudentField = () => {
		const humanizedDuration = moment.duration(student.TotalHoursInSessions, "hours").locale("pt-br").humanize();
		const totalHoursField = `- **CARGA HORÁRIA TOTAL:** ${humanizedDuration}`;

		const presenceField = `- **PRESENÇA EM:**`
			.concat(`\n  - [${student.TimesPresentInNormalSessions}] ${SessionEnum.DisplayNamePlural.reabilitacao}`)
			.concat(`\n  - [${student.TimesPresentInDetourSessions}] ${SessionEnum.DisplayNamePlural["side-quest"]}`)
			.concat(`\n  - [${student.TimesPresentInSpecialSessions}] ${SessionEnum.DisplayNamePlural.congregacao}`);

		const final = totalHoursField.concat("\n", presenceField);

		return final;
	};

	//

	const BuildEmbed = async () => {
		const embed = new EmbedBuilder();

		embed.setThumbnail(RankEnum.Image.at(rankIndex));

		embed.setAuthor({
			name: targetMember.displayName,
			iconURL: targetMember.displayAvatarURL(),
		});

		embed.addFields(
			{
				name: "# XP",
				value: await GetXPField(),
			},

			{
				name: "# Estudante",
				value: GetStudentField(),
			}
		);

		return embed;
	};

	const embed = await BuildEmbed();

	interaction.reply({ embeds: [embed] });
};
