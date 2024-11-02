/*
	This handles disconnecting sessions and posting its reports
*/

const { EmbedBuilder, time } = require("discord.js");
const moment = require("moment");
const SessionEnum = require("../Enums/Session");
const RankEnum = require("../../XP/Enums/Rank");
const GetRankIndexFromXP = require("../../XP/Utility/GetRankIndexFromXP");
const GetRankXPProgress = require("../../XP/Utility/GetRankXPProgress");
const GetRankEmojiAsMessage = require("../../XP/Utility/GetRankEmojiAsMessage");

///

const GetProsperingField = () => {
	return "- **PROSPERANDO:** SIM";
};

const GetDateField = (customDate) => {
	const GetTodaysDate = () => {
		const date = moment().locale("pt-br");

		return date.format("LLLL");
	};

	const date = customDate || GetTodaysDate();

	return `- **Data:** ${date}`;
};

const GetTimeField = (sessionDurationMilliseconds) => {
	const duration = moment.duration(sessionDurationMilliseconds).locale("pt-br");
	let timeString;

	if (duration.asHours() < 24) {
		timeString = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
	} else {
		timeString = duration.humanize();
	}

	return `- **Tempo:** ${timeString}`;
};

const GetPresenceField = (sessionXPResults) => {
	let presenceField = `- **Presença:**`;

	for (const studentUserID of sessionXPResults.keys()) {
		presenceField = presenceField.concat(" ", `<@${studentUserID}>`, ",");
	}

	return presenceField;
};

// EXAMPLE: "- @user: +20 XP - (100/250) :emoji:"
// Sorted from highest XP gained to lowest
const GetProgressionField = (sessionXPResults) => {
	const GetSortedGainList = () => {
		const sortedArray = [...sessionXPResults].sort((a, b) => {
			return b[1].Gain - a[1].Gain;
		});

		const sortedMap = new Map(sortedArray);

		return sortedMap;
	};

	const sortedXPResults = GetSortedGainList();
	let progressionField = "";

	for (const [studentUserID, results] of sortedXPResults.entries()) {
		const rankIndex = GetRankIndexFromXP(results.Total);
		const rankProgress = GetRankXPProgress(results.Total);
		const requirementOfNextRank = RankEnum.XPRequirement.at(rankIndex + 1) || "MAX";
		const emoji = GetRankEmojiAsMessage(rankIndex);

		progressionField = progressionField.concat(
			"\n ",
			`- <@${studentUserID}>: `,
			`+${results.Gain} XP - `,
			`(${rankProgress}/${requirementOfNextRank}) `,
			`${emoji}`
		);

		if (results.HasRankedUp) {
			progressionField = progressionField.concat(" [SUBIU!!!]");
		}
	}

	return progressionField;
};

///

const SendNormalMessage = async (
	sessionDurationMilliseconds,
	sessionType,
	sessionStats,
	channel,
	sessionXPResults,
	customDate
) => {
	const prosperingField = GetProsperingField();
	const dateField = GetDateField(customDate);
	const timeField = GetTimeField(sessionDurationMilliseconds);
	const presenceField = GetPresenceField(sessionXPResults);
	const progressionField = GetProgressionField(sessionXPResults);

	const GetReport = () => {
		const displayName = SessionEnum.DisplayName[sessionType];
		const sessionNumber = sessionStats.NormalSessionNumber;

		const header = `# ${displayName} [${sessionNumber}]`;
		const details = "## Detalhes".concat("\n", prosperingField, "\n", dateField, "\n", presenceField, "\n", timeField);
		const progression = "## Progressão".concat("\n", progressionField);

		return header.concat("\n", details, "\n", progression);
	};

	const SendMessage = async () => {
		const content = GetReport();

		await channel.send({ content: content });
	};

	await SendMessage();
};

const SendDetourMessage = async (
	sessionDurationMilliseconds,
	sessionType,
	sessionStats,
	channel,
	sessionXPResults,
	customDate
) => {
	const dateField = GetDateField(customDate);
	const timeField = GetTimeField(sessionDurationMilliseconds);
	const presenceField = GetPresenceField(sessionXPResults);
	const progressionField = GetProgressionField(sessionXPResults);

	const GetReport = () => {
		const embed = new EmbedBuilder();
		const displayName = SessionEnum.DisplayName[sessionType];
		const sessionNumber = sessionStats.DetourSessionNumber;

		embed.setTitle(`${displayName} [${sessionNumber}]`);
		embed.addFields(
			{
				name: "Detalhes",
				value: dateField.concat("\n", presenceField, "\n", timeField),
				inline: true,
			},

			{
				name: "Progressão",
				value: progressionField,
			}
		);

		return embed;
	};

	const SendMessage = async () => {
		const report = GetReport();

		await channel.send({ embeds: [report] });
	};

	await SendMessage();
};

const SendSpecialMessage = async (
	sessionDurationMilliseconds,
	sessionType,
	sessionStats,
	channel,
	sessionXPResults,
	customDate
) => {
	const prosperingField = GetProsperingField();
	const dateField = GetDateField(customDate);
	const timeField = GetTimeField(sessionDurationMilliseconds);
	const presenceField = GetPresenceField(sessionXPResults);
	const progressionField = GetProgressionField(sessionXPResults);

	const ConvertToRomanNumeral = (number) => {
		const numerals = {
			M: 1000,
			CM: 900,
			D: 500,
			CD: 400,
			C: 100,
			XC: 90,
			L: 50,
			XL: 40,
			X: 10,
			IX: 9,
			V: 5,
			IV: 4,
			I: 1,
		};

		var converted = "";

		for (var i of Object.keys(numerals)) {
			var q = Math.floor(number / numerals[i]);

			number -= q * numerals[i];
			converted += i.repeat(q);
		}

		return converted;
	};

	const GetReport = () => {
		const displayName = SessionEnum.DisplayName[sessionType];
		const sessionNumber = ConvertToRomanNumeral(sessionStats.SpecialSessionNumber);

		const header = `# ★ ${displayName} [${sessionNumber}] ★`;
		const details = "## Detalhes".concat("\n", prosperingField, "\n", dateField, "\n", presenceField, "\n", timeField);
		const progression = "## Progressão".concat("\n", progressionField);

		return header.concat("\n", details, "\n", progression);
	};

	const SendMessage = async () => {
		const content = GetReport();

		await channel.send({ content: content });
	};

	await SendMessage();
};

///

module.exports = (sessionType) => {
	if (sessionType === SessionEnum.SessionType.Normal) {
		return SendNormalMessage;
	} else if (sessionType === SessionEnum.SessionType.Detour) {
		return SendDetourMessage;
	} else if (sessionType === SessionEnum.SessionType.Special) {
		return SendSpecialMessage;
	}
};
