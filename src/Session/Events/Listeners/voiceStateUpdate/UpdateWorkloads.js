/*
	This will provide the info needed to know how much time a person was in a session, taking into account leaving and rejoining
*/

const SessionSchema = require("../../../Models/Session");

///

module.exports = async (client, oldState, newState) => {
	const GetSession = async () => {
		let session;

		if (newState.channel !== null) {
			session = await SessionSchema.findOne({
				GuildID: newState.guild.id,
				VoiceChannelID: newState.channel.id,
			});
		} else {
			session = await SessionSchema.findOne({
				GuildID: oldState.guild.id,
				VoiceChannelID: oldState.channel.id,
			});
		}

		return session;
	};

	const session = await GetSession();

	if (!session) return;

	//

	const GetUserWhoJoined = () => {
		let userWhoJoined;

		if (newState.channel !== null) {
			userWhoJoined = newState.member.user;
		} else {
			userWhoJoined = oldState.member.user;
		}

		return userWhoJoined;
	};

	const userWhoJoined = GetUserWhoJoined();

	//

	const UpdateWorkload = () => {
		let userWorkloads = session.AttendeesWorkloads.get(userWhoJoined.id);

		// This script and 'AttendeeJoin' have a race condition
		if (!userWorkloads) {
			userWorkloads = [
				{
					JoinTimestamp: Date.now(),
					LeaveTimestamp: null,
				},
			];

			session.AttendeesWorkloads.set(userWhoJoined.id, userWorkloads);
		}

		if (newState.channel !== null) {
			const latestWorkload = userWorkloads.at(-1);

			// Shouldn't be able to create a new workload unless the last one has been finished
			if (!latestWorkload.LeaveTimestamp) return;

			userWorkloads.push({
				JoinTimestamp: Date.now(),
				LeaveTimestamp: null,
			});
		} else {
			const latestWorkload = userWorkloads.at(-1);

			latestWorkload.LeaveTimestamp = Date.now();
		}
	};

	UpdateWorkload();

	//

	const SaveChangesProperly = async () => {
		session.markModified("AttendeesWorkloads");
		await session.save();
	};

	await SaveChangesProperly();
};
