/*
	This will take a directory of command objects and call one of its commands if the names match
*/

const GetChildrenOfDirectory = require("../../Utility/GetChildrenOfDirectory");

///

module.exports = (thisObjectDirectory, client, interaction) => {
	const AssertInteractionIsACommand = () => {
		if (interaction.isChatInputCommand()) {
			return;
		}

		throw new Error("Interaction is not a chat command");
	};

	AssertInteractionIsACommand();

	//

	const RunObjectCallbacks = () => {
		const objects = GetChildrenOfDirectory(thisObjectDirectory);

		for (const commandObject of objects) {
			const { discord, app } = require(commandObject);

			if (discord.name === interaction.commandName) {
				app.callback(client, interaction);
			}
		}
	};

	RunObjectCallbacks();
};
