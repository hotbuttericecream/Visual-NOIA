/*
	This will provide the info needed to know how much time a person was in a session, taking into account leaving and rejoining
*/

const SessionSchema = require("../../../Models/Session");

///

const GetWorkloads = (session, user) => {
	let workloads = session.AttendeesWorkloads.get(user.id);

	// This script and 'AttendeeJoin' have a race condition
	if (!workloads) {
		workloads = [
			{
				JoinTimestamp: Date.now(),
				LeaveTimestamp: null,
			},
		];

		session.AttendeesWorkloads.set(user.id, workloads);
	}

	return workloads;
};

const SaveChangesProperly = async (session) => {
	session.markModified("AttendeesWorkloads");
	await session.save();
};

module.exports = async (client, oldState, newState) => {
	// variable names are wrong state changes when opening livestream
	const voiceChannelJoined = newState.channel;
	const voiceChannelLeft = oldState.channel;

	if (voiceChannelJoined === voiceChannelLeft) {
		return;
	}

	// Joined a new vc: add a new start timestamp to the session in there

	if (voiceChannelJoined !== null) {
		const guildID = newState.guild.id;

		const session = await SessionSchema.findOne({
			GuildID: guildID,
			VoiceChannelID: voiceChannelJoined.id,
		});

		if (session) {
			const user = newState.member.user;

			const AddStartTimestamp = () => {
				const workloads = GetWorkloads(session, user);
				const latestWorkload = workloads.at(-1);

				// Shouldn't be able to create a new workload unless the last one has been finished
				if (!latestWorkload.LeaveTimestamp) return;

				workloads.push({
					JoinTimestamp: Date.now(),
					LeaveTimestamp: null,
				});
			};

			AddStartTimestamp();

			//

			await SaveChangesProperly(session);
		}
	}

	// If left a vc: add a leave timestamp to the session there

	if (voiceChannelLeft !== null) {
		const guildID = oldState.guild.id;

		const session = await SessionSchema.findOne({
			GuildID: guildID,
			VoiceChannelID: voiceChannelLeft.id,
		});

		if (session) {
			const user = oldState.member.user;

			const AddLeaveTimestamp = () => {
				const workloads = GetWorkloads(session, user);
				const latestWorkload = workloads.at(-1);

				latestWorkload.LeaveTimestamp = Date.now();
			};

			AddLeaveTimestamp();

			//

			await SaveChangesProperly(session);
		}
	}
};
