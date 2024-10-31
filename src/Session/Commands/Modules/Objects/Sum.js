/*
	This is a command that sums two numbers. Purpose is to check if the bot is working
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/Sum");
const SomarEnum = require("../Enums/Sum");

///

module.exports = {
	discord: {
		name: "somar",
		description: "Comando teste. Soma dois números",

		options: [
			{
				name: SomarEnum.CommandOption.X,
				description: "O primeiro",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},

			{
				name: SomarEnum.CommandOption.Y,
				description: "O segundo",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
