/*
	This command gives you a list of the people with the most XP
*/

const Callback = require("../Callbacks/GetLeaderboard");

///

module.exports = {
	discord: {
		name: "placar",
		description: "Mostrar as pessoas com maior número de XP",
	},

	app: {
		callback: Callback,
	},
};
