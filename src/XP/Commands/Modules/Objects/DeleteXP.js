/*
	This command deletes a user from the XP database
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/DeleteXP");
const DeleteXPEnum = require("../Enums/DeleteXP");

///

module.exports = {
	discord: {
		name: "xp-deletar",
		description: "(Organizadores): deletar uma pessoa do banco de dados de XP",

		options: [
			{
				name: DeleteXPEnum.CommandOption.UserID,
				description: "O ID da pessoa",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
