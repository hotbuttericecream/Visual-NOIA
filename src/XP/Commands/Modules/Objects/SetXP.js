/*
	This command directly edits a user's XP amount
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/SetXP");
const SetXPEnum = require("../Enums/SetXP");

///

module.exports = {
	discord: {
		name: "xp-editar",
		description: "(Organizadores): mudar diretamente a quantidade de XP de alguém",

		options: [
			{
				name: SetXPEnum.CommandOption.User,
				description: "A pessoa",
				type: ApplicationCommandOptionType.User,
				required: true,
			},

			{
				name: SetXPEnum.CommandOption.NewXP,
				description: "A nova quantidade de XP",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
