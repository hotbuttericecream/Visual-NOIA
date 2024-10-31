/*
	This increments session numbers
*/

const SessionStatsSchema = require("../Models/SessionStats");
const SessionEnum = require("../Enums/Session");

///

module.exports = async (guildID, sessionType) => {
	const GetOrCreateSessionStats = async () => {
		let sessionStats = await SessionStatsSchema.findOne({
			GuildID: guildID,
		});

		if (!sessionStats) {
			sessionStats = new SessionStatsSchema({
				GuildID: guildID,
				NormalSessionNumber: 0,
				DetourSessionNumber: 0,
				SpecialSessionNumber: 0,
			});
		}

		return sessionStats;
	};

	const sessionStats = await GetOrCreateSessionStats();

	//

	const IncrementSessionNumber = () => {
		if (sessionType === SessionEnum.SessionType.Normal) {
			sessionStats.NormalSessionNumber += 1;
		} else if (sessionType === SessionEnum.SessionType.Detour) {
			sessionStats.DetourSessionNumber += 1;
		} else if (sessionType === SessionEnum.SessionType.Special) {
			sessionStats.SpecialSessionNumber += 1;
		}
	};

	IncrementSessionNumber();

	await sessionStats.save();

	//

	return sessionStats;
};
