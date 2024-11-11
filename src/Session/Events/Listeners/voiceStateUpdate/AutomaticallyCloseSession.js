/*
	This handles closing sessions after the voice chat has remained empty for a while
*/

const SessionSchema = require("../../../Models/Session");
const CloseSession = require("../../../Scripts/CloseSession");

///

const SECONDS_BEFORE_AUTO_EXPIRE = 10;
const voiceChannelTimeouts = new Map();

module.exports = async (client, oldState, newState) => {
	const GetVoiceChatID = () => {
		let voiceChatID;

		if (newState.channel !== null) {
			voiceChatID = newState.channel.id;
		} else {
			voiceChatID = oldState.channel.id;
		}

		return voiceChatID;
	};

	const voiceChatID = GetVoiceChatID();

	//

	const ClearCloseTimeout = () => {
		const timeout = voiceChannelTimeouts.get(voiceChatID);

		if (timeout) {
			voiceChannelTimeouts.delete(voiceChatID);
			clearTimeout(timeout);
		}
	};

	if (newState.channel !== null) {
		ClearCloseTimeout();
		return;
	}

	//

	const IsVoiceChatEmpty = () => {
		const numberOfPeopleInCall = oldState.channel.members.size;

		return numberOfPeopleInCall === 0;
	};

	if (!IsVoiceChatEmpty()) return;

	//

	const guildID = oldState.guild.id;

	let session = await SessionSchema.findOne({
		GuildID: guildID,
		VoiceChannelID: voiceChatID,
	});

	if (!session) return;

	//

	const SetCloseTimeout = () => {
		const Clear = async () => {
			voiceChannelTimeouts.delete(voiceChatID);

			// Might've been closed manually before the timer ran out
			session = await SessionSchema.findOne({
				GuildID: guildID,
				VoiceChannelID: voiceChatID,
			});

			if (!session) return;

			CloseSession(client, session);
		};

		voiceChannelTimeouts.set(voiceChatID, setTimeout(Clear, SECONDS_BEFORE_AUTO_EXPIRE * 1000));
	};

	SetCloseTimeout();
};
