/*
	This ties command calls to the event
*/

const path = require("path");
const CallCommandFrom = require("../../../../Core/Commands/Scripts/CallCommandFrom");

///

const COMMAND_OBJECTS_DIRECTORY = path.join(__dirname, "..", "..", "..", "Commands", "Modules", "Objects");

module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return;

	CallCommandFrom(COMMAND_OBJECTS_DIRECTORY, client, interaction)
};
