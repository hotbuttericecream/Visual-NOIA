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
		reabilitacao: 60,
		"side-quest": 30,
		congregacao: 128,
	},
};
