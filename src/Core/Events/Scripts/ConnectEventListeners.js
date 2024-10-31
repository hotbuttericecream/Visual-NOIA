/*
	This connects the functions of a directory to their respective discord events
*/

const path = require("path");
const GetChildrenOfDirectory = require("../../Utility/GetChildrenOfDirectory");

///

module.exports = (client, ofThisDirectory) => {
	const ConnectListenersToEvents = () => {
		const eventDirectories = GetChildrenOfDirectory(ofThisDirectory);

		for (const eventDirectory of eventDirectories) {
			const event = path.basename(eventDirectory);
			const files = GetChildrenOfDirectory(eventDirectory);

			client.on(event, async (...args) => {
				for (const listener of files) {
					const connection = require(listener);

					connection(client, ...args);
				}
			});
		}
	};

	ConnectListenersToEvents();
};
