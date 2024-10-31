/*
	This is a command that sums two numbers. Purpose is to check if the bot is working
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/StartSession");
const StartSessionEnum = require("../Enums/StartSession");
const SessionEnum = require("../../../Enums/Session");

///

module.exports = {
	discord: {
		name: "sessao-iniciar",
		description: "Começar uma nova sessão",

		options: [
			{
				name: StartSessionEnum.CommandOption.SessionType,
				description: "(Organizadores): O tipo de sessão",
				type: ApplicationCommandOptionType.String,

				choices: [
					{
						name: SessionEnum.SessionType.Normal,
						value: SessionEnum.SessionType.Normal,
					},
					{
						name: SessionEnum.SessionType.Detour,
						value: SessionEnum.SessionType.Detour,
					},
					{
						name: SessionEnum.SessionType.Special,
						value: SessionEnum.SessionType.Special,
					},
				],
			},

			{
				name: StartSessionEnum.CommandOption.XpPerHour,
				description: "(Organizadores): Colocar uma quantidade de XP por hora diferente do padrão",
				type: ApplicationCommandOptionType.Number,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
