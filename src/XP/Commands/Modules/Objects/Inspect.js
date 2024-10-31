/*
	This command lets you see a person's stats
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/Inspect");
const InspectEnum = require("../Enums/Inspect");

///

module.exports = {
	discord: {
		name: "inspecionar",
		description: "Ver as conquistas de um usuário",

		options: [
			{
				name: InspectEnum.CommandOption.User,
				description: "A pessoa",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
