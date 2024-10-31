/*
	This is what's called to handle the command
*/

const moment = require("moment");
const SimulateSessionEnum = require("../Enums/SimulateSession");
const SessionEnum = require("../../../Enums/Session");
const SettingsSchema = require("../../../../Core/Models/Settings");
const GetOrCreateStudent = require("../../../../Core/Utility/GetOrCreateStudent");
const UpdateStudentStats = require("../../../Scripts/UpdateStudentStats");
const UpdateSessionStats = require("../../../Scripts/UpdateSessionStats");
const GetReportMessageSender = require("../../../Scripts/GetReportMessageSender");
const GetLeaderboard = require("../../../../XP/Scripts/GetLeaderboard");
const GetLeaderboardEmbed = require("../../../../XP/Scripts/GetLeaderboardEmbed");
const GetTopStudentsString = require("../../../../XP/Scripts/GetTopStudentsString");

///

module.exports = async (client, interaction) => {
	const guildID = interaction.guild.id;

	const serverSettings = await SettingsSchema.findOne({
		GuildID: guildID,
	});

	if (!serverSettings) {
		interaction.reply({
			content: "**Erro:** o bot precisa ser configurado primeiro",
			ephemeral: true,
		});

		return;
	}

	//

	const AssertIsCallerAnOrganizer = () => {
		const is = interaction.member.roles.cache.has(serverSettings.OrganizerRoleID);

		if (!is) {
			interaction.reply({
				content: "**Erro:** só organizadores conseguem usar esse comando",
				ephemeral: true,
			});

			return false;
		}

		return true;
	};

	if (!AssertIsCallerAnOrganizer()) return;

	//

	await interaction.deferReply({
		ephemeral: true,
	});

	const ParseMembers = async () => {
		const listInString = interaction.options.get(SimulateSessionEnum.CommandOption.UserIDList).value;
		const list = listInString.split(",");

		let members = [];

		for (const userID of list) {
			let member;

			try {
				member = await interaction.guild.members.fetch(userID);
			} catch (error) {
				member = undefined;
			}

			if (!member) {
				interaction.editReply(`**Erro:** o ID "${userID}" não existe nesse servidor`);
				return;
			}

			const hasMemberAlreadyBeenParsed = members.includes(member);

			if (hasMemberAlreadyBeenParsed) {
				interaction.editReply(`**Erro:** você botou um ID repetido, todo safado.`);
				return;
			}

			members.push(member);
		}

		return members;
	};

	const members = await ParseMembers();

	if (!members) return;

	//

	const GetDateAndTime = () => {
		const dateAndTimeString = interaction.options.get(SimulateSessionEnum.CommandOption.DateAndTime).value;
		const dateAndTime = moment(dateAndTimeString, "DD/MM/YYYY HH:mm:ss", true).locale("pt-br");

		if (!dateAndTime.isValid()) {
			interaction.editReply(`**Erro:** data escrita errada, favor siga o formato DD/MM/YYYY HH:mm:ss`);
			return;
		}

		if (dateAndTime.isAfter()) {
			interaction.editReply(`**Erro:** esperto, você não pode simular uma sessão no futuro`);
			return;
		}

		return dateAndTime;
	};

	const dateAndTime = GetDateAndTime();

	if (!dateAndTime) return;

	//

	const sessionType = interaction.options.get(SimulateSessionEnum.CommandOption.SessionType).value;
	const sessionHourDuration = interaction.options.get(SimulateSessionEnum.CommandOption.HoursSpent).value;
	const simulatedXPResults = new Map();

	const SimulateUpdatingStudentStats = async () => {
		let xpPerHour = interaction.options.get(SimulateSessionEnum.CommandOption.XpPerHour)?.value;

		if (xpPerHour === undefined) {
			xpPerHour = SessionEnum.Reward[sessionType];
		}

		for (const member of members) {
			const student = await GetOrCreateStudent.ConsideringIfIsAlt(guildID, member.user.id);

			const [total, gain, hasRankedUp] = await UpdateStudentStats(
				guildID,
				student,
				sessionHourDuration,
				sessionType,
				xpPerHour
			);

			simulatedXPResults.set(student.UserID, {
				Total: total,
				Gain: gain,
				HasRankedUp: hasRankedUp,
			});
		}
	};

	await SimulateUpdatingStudentStats();

	//

	const sessionStats = await UpdateSessionStats(guildID, sessionType);

	const SendReport = async () => {
		const reportChannel = await client.channels.fetch(serverSettings.ReportChannelID);

		if (!reportChannel) return;

		const dateAndTimeSessionDurationAhead = dateAndTime.clone();

		dateAndTimeSessionDurationAhead.add(sessionHourDuration, "hours");

		const sessionDurationMilliseconds = dateAndTimeSessionDurationAhead.diff(dateAndTime, "milliseconds");
		const date = dateAndTime.format("LLLL");
		const sendReportMessage = GetReportMessageSender(sessionType);

		await sendReportMessage(
			sessionDurationMilliseconds,
			sessionType,
			sessionStats,
			reportChannel,
			simulatedXPResults,
			date
		);
	};

	await SendReport();

	//

	const PostLeaderboard = async () => {
		const [leaderboard] = await GetLeaderboard();
		const topStudentsString = await GetTopStudentsString(interaction.guild, leaderboard);

		const leaderboardEmbed = GetLeaderboardEmbed(topStudentsString);
		const leaderboardChannel = await client.channels.fetch(serverSettings.PostSessionLeaderboardChannelID);

		const sessionDisplayName = SessionEnum.DisplayName[sessionType];
		const sessionNumber = sessionStats.DetourSessionNumber;

		await leaderboardChannel.send({
			content: `## ${sessionDisplayName} [${sessionNumber}]`,
			embeds: [leaderboardEmbed],
		});
	};

	await PostLeaderboard();

	//

	interaction.editReply("Sessão simulada com sucesso!");
};
