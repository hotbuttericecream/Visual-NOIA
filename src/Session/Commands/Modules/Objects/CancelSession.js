/*
	This command stops a session without applying xp or posting a report
*/

const Callback = require("../Callbacks/CancelSession");

///

module.exports = {
	discord: {
		name: "sessao-cancelar",
		description: "Fecha uma sessão sem adicionar XP ou postar um relatório",
	},

	app: {
		callback: Callback,
	},
};
