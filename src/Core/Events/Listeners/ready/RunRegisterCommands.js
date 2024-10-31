/*
	This loads all the commands present in the source code
*/

const path = require("path");
const RegisterCommands = require("../../../Commands/Scripts/RegisterCommands");

///

const SESSION_COMMANDS = path.join(__dirname, "..", "..", "..", "..", "Session", "Commands", "Modules", "Objects");
const XP_COMMANDS = path.join(__dirname, "..", "..", "..", "..", "XP", "Commands", "Modules", "Objects");

module.exports = (client) => {
	RegisterCommands(client, [SESSION_COMMANDS, XP_COMMANDS]);
};
