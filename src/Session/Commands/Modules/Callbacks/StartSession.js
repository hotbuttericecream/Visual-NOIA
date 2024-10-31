/*
	This is what's called to handle the command
*/

const { EmbedBuilder } = require("discord.js");
const StartSessionEnum = require("../Enums/StartSession");
const SessionEnum = require("../../../Enums/Session");
const SessionSchema = require("../../../Models/Session");
const SettingsSchema = require("../../../../Core/Models/Settings");

///

module.exports = async (client, interaction) => {
	const serverSettings = await SettingsSchema.findOne({
		GuildID: interaction.guild.id,
	});

	if (!serverSettings) {
		interaction.reply({
			content: "**Erro:** o bot precisa ser configurado primeiro",
			ephemeral: true,
		});

		return;
	}

	//

	const member = interaction.member;
	const voiceChannel = member.voice.channel;

	if (!voiceChannel) {
		interaction.reply({
			content: "**Erro:** você precisa estar em uma chamada de voz pra iniciar uma sessão!",
			ephemeral: true,
		});

		return;
	}

	//

	const AssertIsThereAlreadyASession = async () => {
		const existingSession = await SessionSchema.findOne({
			GuildID: interaction.guild.id,
			VoiceChannelID: voiceChannel.id,
		});

		if (existingSession) {
			interaction.reply({
				content: "**Erro:** não foi possível iniciar uma sessão, já tem uma ativa nesse canal de voz",
				ephemeral: true,
			});

			return true;
		}

		return false;
	};

	if (await AssertIsThereAlreadyASession()) return;

	//

	const IsMemberAnOrganizer = member.roles.cache.has(serverSettings.OrganizerRoleID);

	const GetSessionType = () => {
		let sessionType = interaction.options.get(StartSessionEnum.CommandOption.SessionType)?.value;

		// Tried to set option without being an organizer
		if (!IsMemberAnOrganizer && sessionType) {
			interaction.reply({
				content: "**Erro:** só organizadores conseguem editar o tipo de sessão",
				ephemeral: true,
			});

			return;
		}

		if (!sessionType) {
			sessionType = SessionEnum.SessionType.Detour;
		}

		return sessionType;
	};

	const GetXpPerHour = () => {
		let xpPerHour = interaction.options.get(StartSessionEnum.CommandOption.XpPerHour)?.value;

		// Tried to set option without being an organizer
		if (!IsMemberAnOrganizer && xpPerHour) {
			interaction.reply({
				content: "**Erro:** só organizadores conseguem editar o XP por hora",
				ephemeral: true,
			});

			return;
		}

		// 0 is falsy
		if (xpPerHour === undefined) {
			xpPerHour = SessionEnum.Reward[sessionType];
		}

		return xpPerHour;
	};

	const sessionType = GetSessionType();
	const xpPerHour = GetXpPerHour();

	if (!sessionType || !xpPerHour) return;

	//

	const CreateNewSession = () => {
		const newSession = new SessionSchema({
			GuildID: interaction.guild.id,
			VoiceChannelID: voiceChannel.id,
			SessionType: sessionType,
			XpPerHour: xpPerHour,
			Attendees: [],
			AttendeesWorkloads: {},
			StartTimestamp: Date.now(),
		});

		for (const memberCollection of voiceChannel.members) {
			const user = memberCollection.find((element) => element.user);

			newSession.Attendees.push(user.id);
			newSession.AttendeesWorkloads.set(user.id, [
				{
					JoinTimestamp: Date.now(),
					LeaveTimestamp: null,
				},
			]);
		}

		return newSession;
	};

	const newSession = CreateNewSession();

	await interaction.deferReply();
	await newSession.save();

	//

	const PostReply = () => {
		const embed = new EmbedBuilder();

		const displayName = SessionEnum.DisplayName[sessionType];

		embed.setTitle(`${displayName}`);
		embed.setDescription(`Começada no canal \`${voiceChannel.name}\``);
		embed.addFields({
			name: "XP",
			value: `**${xpPerHour} XP** por hora`,
			inline: true,
		});

		interaction.editReply({ embeds: [embed] });
	};

	PostReply();
};
