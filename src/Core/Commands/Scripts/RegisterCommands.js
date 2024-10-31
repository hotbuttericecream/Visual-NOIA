/*
	This sets the bot's slash commands. Meaning it will delete the commands that are present in the server but not in the directory
*/

const GetChildrenOfDirectory = require("../../Utility/GetChildrenOfDirectory");

///

// The "object directory" is where info related to the command is stored. I.e: API info
module.exports = async (client, ofTheseObjectDirectories) => {
	const GetCommands = () => {
		let commands = [];

		for (const directory of ofTheseObjectDirectories) {
			const objects = GetChildrenOfDirectory(directory);

			for (const commandObject of objects) {
				const { discord } = require(commandObject);

				commands.push(discord);
			}
		}

		return commands;
	};

	const commands = GetCommands();

	//

	const Register = async () => {
		const applicationCommands = await client.application.commands;

		applicationCommands.set(commands).then(() => {
			console.log("Commands set");
		});
	};

	await Register();
};
