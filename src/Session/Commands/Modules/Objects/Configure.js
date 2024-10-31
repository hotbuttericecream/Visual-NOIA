/*
	This command sets the bot up
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/Configure");
const ConfigureEnum = require("../Enums/Configure");

///

module.exports = {
	discord: {
		name: "configurar",
		description: "Configura o bot",

		options: [
			{
				name: ConfigureEnum.CommandOption.ReportChannel,
				description: "O canal pra onde os relatórios de sessões sao postados",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},

			{
				name: ConfigureEnum.CommandOption.PostSessionLeaderboardChannel,
				description: "O canal pra onde postar um placar após uma sessão acabar",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},

			{
				name: ConfigureEnum.CommandOption.OrganizerRole,
				description: "O cargo de pessoas que podem configurar partes sensíveis do bot",
				type: ApplicationCommandOptionType.Role,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
