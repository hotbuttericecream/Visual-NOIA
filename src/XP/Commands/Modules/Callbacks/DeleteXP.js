/*
	This is what's called to handle the command
*/

const DeleteXPEnum = require("../Enums/DeleteXP");
const XPSchema = require("../../../Models/XP");
const SettingsSchema = require("../../../../Core/Models/Settings");
const StudentSchema = require("../../../../Core/Models/Student");

///

module.exports = async (client, interaction) => {
	const guildID = interaction.guild.id;

	const serverSettings = await SettingsSchema.findOne({
		GuildID: guildID,
	});

	if (!serverSettings) {
		interaction.reply({
			content: "**Erro:** o bot precisa ser configurado primeiro",
			ephemeral: true,
		});

		return;
	}

	//

	const AssertIsCallerAnOrganizer = () => {
		const is = interaction.member.roles.cache.has(serverSettings.OrganizerRoleID);

		if (!is) {
			interaction.reply({
				content: "**Erro:** só organizadores conseguem usar esse comando",
				ephemeral: true,
			});

			return false;
		}

		return true;
	};

	if (!AssertIsCallerAnOrganizer()) return;

	//

	const targetUserID = interaction.options.get(DeleteXPEnum.CommandOption.UserID).value;

	await interaction.deferReply();

	// For convenience
	await StudentSchema.findOneAndDelete({
		GuildID: guildID,
		UserID: targetUserID,
	});

	//

	const xpQuery = {
		GuildID: guildID,
		UserID: targetUserID,
	};

	const userXP = await XPSchema.findOne(xpQuery);

	if (!userXP) {
		interaction.editReply({
			content: "**Erro:** esse usuário não existe no banco de dados de XP",
			ephemeral: true,
		});

		return;
	}

	await userXP.deleteOne(xpQuery);

	//

	interaction.editReply(`<${targetUserID}> foi deletado do banco de dados de XP`);
};
