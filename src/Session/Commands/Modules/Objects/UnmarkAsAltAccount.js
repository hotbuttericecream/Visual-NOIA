/*
	This is a command that sums two numbers. Purpose is to check if the bot is working
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/UnmarkAsAltAccount");
const UnmarkAsAltAccountEnum = require("../Enums/UnmarkAsAltAccount");

///

module.exports = {
	discord: {
		name: "retirar-como-conta-secundaria",
		description: "Isso vai desmarcar o usuário como uma conta secundaria",

		options: [
			{
				name: UnmarkAsAltAccountEnum.CommandOption.User,
				description: "Qual é a conta secundária",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
