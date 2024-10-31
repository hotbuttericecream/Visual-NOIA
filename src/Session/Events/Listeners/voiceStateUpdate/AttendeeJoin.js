/*
	This adds an attendee to an active session if they join it's voice chat
*/

const SessionSchema = require("../../../Models/Session");

///

module.exports = async (client, oldState, newState) => {
	const hasLeftVoiceChat = newState.channel === null;

	if (hasLeftVoiceChat) return;

	//

	const session = await SessionSchema.findOne({
		GuildID: newState.guild.id,
		VoiceChannelID: newState.channel.id,
	});

	if (!session) return;

	//

	const userWhoJoined = newState.member.user;

	const GetIsAlreadyIn = () => {
		const isAlreadyIn = session.Attendees.find((element) => element === userWhoJoined.id);

		return isAlreadyIn;
	};

	if (GetIsAlreadyIn()) return;

	//

	const UpdateVariables = () => {
		session.Attendees.push(userWhoJoined.id);

		// This script and 'UpdateWorkloads' have a race condition
		const workloads = session.AttendeesWorkloads.get(userWhoJoined.id);

		if (workloads) return;

		session.AttendeesWorkloads.set(userWhoJoined.id, [
			{
				JoinTimestamp: Date.now(),
				LeaveTimestamp: null,
			},
		]);

		session.markModified("AttendeesWorkloads");
	};

	UpdateVariables();

	//

	await session.save();
};
