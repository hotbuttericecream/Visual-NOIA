/*
	This is what's called to handle the command
*/

const MarkAsAltAccountEnum = require("../Enums/MarkAsAltAccount");
const StudentSchema = require("../../../../Core/Models/Student");
const GetOrCreateStudent = require("../../../../Core/Utility/GetOrCreateStudent");

///

module.exports = async (client, interaction) => {
	const guildID = interaction.guild.id;
	const altAccount = interaction.options.get(MarkAsAltAccountEnum.CommandOption.AltAccount).user;
	const student = await GetOrCreateStudent.RegardlessIfIsAlt(guildID, altAccount.id);

	//

	const mainAccount = interaction.options.get(MarkAsAltAccountEnum.CommandOption.MainAccount).user;

	const CheckIfAltAndMainAreTheSame = () => {
		if (altAccount.id === mainAccount.id) {
			interaction.reply({
				content: "**Erro:** BURRO",
				ephemeral: true,
			});

			return true;
		}

		return false;
	};

	const CheckIfAltsClash = async () => {
		const mainAccountStudent = await StudentSchema.findOne({
			GuildID: guildID,
			UserID: mainAccount.id,
		});

		if (mainAccountStudent?.AltAccountOfUserID === student.UserID) {
			interaction.reply({
				content: "**Erro:** você não é sagaz.",
				ephemeral: true,
			});

			return true;
		}

		return false;
	};

	if (CheckIfAltAndMainAreTheSame()) return;
	if (await CheckIfAltsClash()) return;

	//

	const Configure = async () => {
		student.AltAccountOfUserID = mainAccount.id;
	};

	Configure();

	await interaction.deferReply();
	await student.save();

	//

	interaction.editReply(
		`Sucesso!! <@${altAccount.id}> foi salvo como sendo uma conta secundária de <@${mainAccount.id}>. Em sessões futuras, o XP recebido ira pra essa conta.`
	);
};
