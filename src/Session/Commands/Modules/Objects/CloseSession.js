/*
	This command closes a session
*/

const Callback = require("../Callbacks/CloseSession");

///

module.exports = {
	discord: {
		name: "sessao-fechar",
		description: "Fecha uma sessão",
	},

	app: {
		callback: Callback,
	},
};
