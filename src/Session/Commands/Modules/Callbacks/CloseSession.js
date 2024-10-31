/*
	This is what's called to handle the command
*/

const SessionSchema = require("../../../Models/Session");
const CloseSession = require("../../../Scripts/CloseSession");

///

module.exports = async (client, interaction) => {
	const voiceChannel = interaction.member.voice.channel;

	if (!voiceChannel) {
		interaction.reply({
			content: "**Erro:** que sessão você quer cancelar? Só consigo saber se você esta em uma chamada de voz.",
			ephemeral: true,
		});

		return;
	}

	//

	const session = await SessionSchema.findOne({
		GuildID: interaction.guild.id,
		VoiceChannelID: voiceChannel.id,
	});

	if (!session) {
		interaction.reply({
			content: "**Erro:** não existe uma sessão nesse canal no momento.",
			ephemeral: true,
		});

		return;
	}

	await interaction.deferReply();
	await CloseSession(client, session);

	//

	interaction.editReply("Sessão fechada com successo!");
};
