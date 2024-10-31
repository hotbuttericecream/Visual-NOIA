/*
	This handles closing sessions after the voice chat has remained empty for a while
*/

const SessionSchema = require("../../../Models/Session");
const CloseSession = require("../../../Scripts/CloseSession");

///

const SECONDS_BEFORE_AUTO_EXPIRE = 600;
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
			clearTimeout(timeout);
			voiceChannelTimeouts.delete(voiceChatID);
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

	const session = await SessionSchema.findOne({
		GuildID: oldState.guild.id,
		VoiceChannelID: voiceChatID,
	});

	if (!session) return;

	//

	const SetCloseTimeout = () => {
		const Clear = () => {
			CloseSession(client, session);
			voiceChannelTimeouts.delete(voiceChatID);
		};

		voiceChannelTimeouts.set(voiceChatID, setTimeout(Clear, SECONDS_BEFORE_AUTO_EXPIRE * 1000));
	};

	SetCloseTimeout();
};
