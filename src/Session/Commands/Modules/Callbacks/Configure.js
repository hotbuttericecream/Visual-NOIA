/*
	This is what's called to handle the command
*/

const { ChannelType, PermissionFlagsBits } = require("discord.js");
const ConfigureEnum = require("../Enums/Configure");
const SettingsSchema = require("../../../../Core/Models/Settings");

///

module.exports = async (client, interaction) => {
	const AssertIsMemberAdmin = () => {
		const member = interaction.member;
		const channel = interaction.channel;

		if (!member.permissionsIn(channel).has(PermissionFlagsBits.Administrator)) {
			interaction.reply({
				content: "**Erro:** só ADMINS conseguem usar esse comando",
				ephemeral: true,
			});

			return false;
		}

		return true;
	};

	if (!AssertIsMemberAdmin()) return;

	//

	const reportChannel = interaction.options.get(ConfigureEnum.CommandOption.ReportChannel).channel;
	const leaderboardChannel = interaction.options.get(ConfigureEnum.CommandOption.PostSessionLeaderboardChannel).channel;

	const AssertIsChannelATextChannel = (channel) => {
		if (channel.type !== ChannelType.GuildText) {
			interaction.reply({
				content: "**Erro:** Escolha de canal inválida, só pode canal de texto",
				ephemeral: true,
			});

			return false;
		}

		return true;
	};

	if (!AssertIsChannelATextChannel(reportChannel)) return;
	if (!AssertIsChannelATextChannel(leaderboardChannel)) return;

	//

	const GetOrCreateServerSettings = async () => {
		let serverSettings = await SettingsSchema.findOne({
			GuildID: interaction.guild.id,
		});

		if (!serverSettings) {
			serverSettings = new SettingsSchema({
				GuildID: interaction.guild.id,
			});
		}

		return serverSettings;
	};

	const serverSettings = await GetOrCreateServerSettings();

	//

	const organizerRole = interaction.options.get(ConfigureEnum.CommandOption.OrganizerRole).role;

	const Configure = () => {
		serverSettings.ReportChannelID = reportChannel.id;
		serverSettings.PostSessionLeaderboardChannelID = leaderboardChannel.id;
		serverSettings.OrganizerRoleID = organizerRole.id;
	};

	Configure();

	await interaction.deferReply();
	await serverSettings.save();

	//

	const replyText = `Bot configurado com succeso:`
		.concat(`\n - Canal de relatórios: \`${reportChannel.name}\``)
		.concat(`\n - Canal de placares pós sessão: \`${leaderboardChannel.name}\``)
		.concat(`\n - Cargo de organizador: \`@${organizerRole.name}\``);

	interaction.editReply(replyText);
};
