/*
	This is what's called to handle the command
*/

const SomarEnum = require("../Enums/Sum");

///

module.exports = (client, interaction) => {
	const x = interaction.options.get(SomarEnum.CommandOption.X).value;
	const y = interaction.options.get(SomarEnum.CommandOption.Y).value;

	const GetSum = () => {
		return x + y;
	};

	const sum = GetSum();

	//

	interaction.reply(`(${x}) + (${y}) = ${sum}`);
};
