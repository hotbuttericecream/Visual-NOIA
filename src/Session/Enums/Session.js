/*
	This is so that referring to specific names is stricter and safer
*/

module.exports = {
	SessionType: {
		Normal: "reabilitacao",
		Detour: "side-quest",
		Special: "congregacao",
	},

	DisplayName: {
		reabilitacao: "Rehabilitação",
		"side-quest": "Side-quest",
		congregacao: "Congregação",
	},

	DisplayNamePlural: {
		reabilitacao: "Rehabilitações",
		"side-quest": "Side-quests",
		congregacao: "Congregações",
	},

	Reward: {
		reabilitacao: 75,
		"side-quest": 50,
		congregacao: 128,
	},
};
