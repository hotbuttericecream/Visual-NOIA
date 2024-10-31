/*
	This is what's called to handle the command
*/

const SetXPEnum = require("../Enums/SetXP");
const SettingsSchema = require("../../../../Core/Models/Settings");
const GetOrCreateXPProfile = require("../../../Utility/GetOrCreateXPProfile");
const GetOrCreateStudent = require("../../../../Core/Utility/GetOrCreateStudent");

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

	const targetUser = interaction.options.get(SetXPEnum.CommandOption.User).user;

	await interaction.deferReply();

	// We don't use the student for anything here, but this is for convenience in case you wanna inspect
	// the user right after
	const student = await GetOrCreateStudent.RegardlessIfIsAlt(guildID, targetUser.id);

	await student.save();

	//

	const userXP = await GetOrCreateXPProfile(guildID, targetUser.id);
	const newXP = interaction.options.get(SetXPEnum.CommandOption.NewXP).value;

	const SetNewTotal = () => {
		userXP.Total = newXP;
	};

	SetNewTotal();

	await userXP.save();

	//

	interaction.editReply(`O XP de <@${targetUser.id}> foi salvo como \`${newXP}\``);
};
