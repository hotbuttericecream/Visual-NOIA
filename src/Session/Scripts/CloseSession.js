/*
	This handles disconnecting sessions and posting its reports
*/

const SessionEnum = require("../Enums/Session");
const SettingsSchema = require("../../Core/Models/Settings");
const GetOrCreateStudent = require("../../Core/Utility/GetOrCreateStudent");
const UpdateStudentStats = require("./UpdateStudentStats");
const UpdateSessionStats = require("./UpdateSessionStats");
const GetReportMessageSender = require("./GetReportMessageSender");
const GetLeaderboard = require("../../XP/Scripts/GetLeaderboard");
const GetLeaderboardEmbed = require("../../XP/Scripts/GetLeaderboardEmbed");
const GetTopStudentsString = require("../../XP/Scripts/GetTopStudentsString");

///

module.exports = async (client, session) => {
	const guildID = session.GuildID;
	const sessionType = session.SessionType;

	const sessionXPResults = new Map();

	for (const [attendeeUserID, attendeeWorkloads] of session.AttendeesWorkloads) {
		const student = await GetOrCreateStudent.ConsideringIfIsAlt(guildID, attendeeUserID);

		//

		const hasAlreadyUpdated = sessionXPResults.get(student.UserID);

		if (hasAlreadyUpdated) continue;

		//

		const GetTotalHoursSpent = () => {
			let totalHoursSpent = 0;

			for (const workload of attendeeWorkloads) {
				const leaveTimestamp = workload.LeaveTimestamp || Date.now();
				const milisecondsElapsed = leaveTimestamp - workload.JoinTimestamp;
				const hoursSpent = milisecondsElapsed / (1000 * 60 * 60);

				totalHoursSpent += hoursSpent;
			}

			return totalHoursSpent;
		};

		const totalHoursSpent = GetTotalHoursSpent();

		//

		const [total, gain, hasRankedUp] = await UpdateStudentStats(
			guildID,
			student,
			totalHoursSpent,
			sessionType,
			session.XpPerHour
		);

		sessionXPResults.set(student.UserID, {
			Total: total,
			Gain: gain,
			HasRankedUp: hasRankedUp,
		});
	}

	//

	const sessionStats = await UpdateSessionStats(guildID, sessionType);

	const serverSettings = await SettingsSchema.findOne({
		GuildID: guildID,
	});

	const SendReport = async () => {
		const reportChannel = await client.channels.fetch(serverSettings.ReportChannelID);

		if (!reportChannel) return;

		const sendReportMessage = GetReportMessageSender(sessionType);
		const sessionDurationMilliseconds = Date.now() - session.StartTimestamp;

		await sendReportMessage(sessionDurationMilliseconds, sessionType, sessionStats, reportChannel, sessionXPResults);
	};

	await SendReport();

	//

	const PostLeaderboard = async () => {
		const guild = await client.guilds.fetch(guildID);
		const [leaderboard] = await GetLeaderboard();
		const topStudentsString = await GetTopStudentsString(guild, leaderboard);

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

	await session.deleteOne({
		GuildID: guildID,
		VoiceChannelID: session.VoiceChannelID,
	});
};
