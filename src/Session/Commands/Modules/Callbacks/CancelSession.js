/*
	This is what's called to handle the command
*/

const SessionSchema = require("../../../Models/Session");

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

	const sessionQuery = {
		GuildID: interaction.guild.id,
		VoiceChannelID: voiceChannel.id,
	};

	const session = await SessionSchema.findOne(sessionQuery);

	if (!session) {
		interaction.reply({
			content: "**Erro:** não existe uma sessão nesse canal no momento.",
			ephemeral: true,
		});

		return;
	}

	await interaction.deferReply();
	await session.deleteOne(sessionQuery);

	//

	interaction.editReply(`A sessão em \`${voiceChannel.name}\` foi cancelada com sucesso!`);
};
