/*
	This is a command that sums two numbers. Purpose is to check if the bot is working
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/MarkAsAltAccount");
const MarkAsAltAccountEnum = require("../Enums/MarkAsAltAccount");

///

module.exports = {
	discord: {
		name: "definir-conta-secundaria",
		description: "Isso vai fazer o XP e outras coisas de sessões serem redirecionadas a conta principal",

		options: [
			{
				name: MarkAsAltAccountEnum.CommandOption.AltAccount,
				description: "Qual é a conta secundária",
				type: ApplicationCommandOptionType.User,
				required: true,
			},

			{
				name: MarkAsAltAccountEnum.CommandOption.MainAccount,
				description: "Qual é a conta primária",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
