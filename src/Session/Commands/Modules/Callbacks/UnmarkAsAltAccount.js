/*
	This is what's called to handle the command
*/

const UnmarkAsAltAccountEnum = require("../Enums/UnmarkAsAltAccount");
const StudentSchema = require("../../../../Core/Models/Student");

///

module.exports = async (client, interaction) => {
	const user = interaction.options.get(UnmarkAsAltAccountEnum.CommandOption.User).user;

	const student = await StudentSchema.findOne({
		GuildID: interaction.guild.id,
		UserID: user.id,
	});

	if (!student || !student?.AltAccountOfUserID) {
		interaction.reply({
			content: "**Erro:** essa conta não é uma conta secundária",
			ephemeral: true,
		});

		return;
	}

	//

	const Configure = async () => {
		student.AltAccountOfUserID = null;
	};

	Configure();

	await interaction.deferReply();
	await student.save();

	//

	interaction.editReply(`Sucesso!! <@${user.id}> não é mais considerado uma conta secundária.`);
};
