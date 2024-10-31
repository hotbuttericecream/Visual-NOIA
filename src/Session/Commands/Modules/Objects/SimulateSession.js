/*
	This command updates stats equivalent to having been present in a session
*/

const { ApplicationCommandOptionType } = require("discord.js");
const Callback = require("../Callbacks/SimulateSession");
const SimulateSessionEnum = require("../Enums/SimulateSession");
const SessionEnum = require("../../../Enums/Session");

///

module.exports = {
	discord: {
		name: "sessao-simular",
		description: "(Organizadores): simular o desfecho de uma sessão",

		options: [
			{
				name: SimulateSessionEnum.CommandOption.UserIDList,
				description: 'Uma lista dos IDs dos participantes. Exemplo: "1234,5678".',
				type: ApplicationCommandOptionType.String,
				required: true,
			},

			{
				name: SimulateSessionEnum.CommandOption.HoursSpent,
				description: "Duração da sessão",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},

			{
				name: SimulateSessionEnum.CommandOption.DateAndTime,
				description: "Dia e hora da sessão. Exemplo: 24/12/2019 09:15:00",
				type: ApplicationCommandOptionType.String,
				required: true,
			},

			{
				name: SimulateSessionEnum.CommandOption.SessionType,
				description: "O tipo de sessão",
				type: ApplicationCommandOptionType.String,
				required: true,

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
				name: SimulateSessionEnum.CommandOption.XpPerHour,
				description: "Se for uma quantidade de XP por hora diferente do padrão",
				type: ApplicationCommandOptionType.Number,
			},
		],
	},

	app: {
		callback: Callback,
	},
};
