/*
	This handles closing sessions after the voice chat has remained empty for a while
*/

const SessionSchema = require("../../../Models/Session");
const CloseSession = require("../../../Scripts/CloseSession");

///

const SECONDS_BEFORE_AUTO_EXPIRE = 300;
const voiceChannelTimeouts = new Map();

module.exports = async (client, oldState, newState) => {
	// Clear timeout on channel that was joined

	const voiceChannelJoined = newState.channel;

	// If this is null then the user left the channel
	if (voiceChannelJoined !== null) {
		const ClearCloseTimeout = () => {
			const timeout = voiceChannelTimeouts.get(voiceChannelJoined.id);

			if (timeout) {
				voiceChannelTimeouts.delete(voiceChannelJoined.id);
				clearTimeout(timeout);
			}
		};

		ClearCloseTimeout();
	}

	// Start timeout on channel that was left, if it's empty

	const voiceChannelLeft = oldState.channel;

	// If this is null then the user just joined a vc
	if (voiceChannelLeft !== null) {
		const IsVoiceChatEmpty = () => {
			const numberOfPeopleInCall = voiceChannelLeft.members.size;

			return numberOfPeopleInCall === 0;
		};

		if (!IsVoiceChatEmpty()) return;

		//

		const guildID = oldState.guild.id;

		let session = await SessionSchema.findOne({
			GuildID: guildID,
			VoiceChannelID: voiceChannelLeft.id,
		});

		if (!session) return;

		//

		const SetCloseTimeout = () => {
			const Clear = async () => {
				voiceChannelTimeouts.delete(voiceChannelLeft.id);

				// Might've been closed manually before the timer ran out
				session = await SessionSchema.findOne({
					GuildID: guildID,
					VoiceChannelID: voiceChannelLeft.id,
				});

				if (!session) return;

				CloseSession(client, session);
			};

			voiceChannelTimeouts.set(voiceChannelLeft.id, setTimeout(Clear, SECONDS_BEFORE_AUTO_EXPIRE * 1000));
		};

		SetCloseTimeout();
	}
};
