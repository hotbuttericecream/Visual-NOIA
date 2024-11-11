/*
	This will load up the database and start up the bot
*/

const { Client, GatewayIntentBits } = require("discord.js");
const Mongoose = require("mongoose");
const Startup = require("./Core/Scripts/Startup");
const AppEnum = require("./Core/Enums/App");

///

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

const URI = AppEnum.IsTest ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

//

const Boot = async () => {
	try {
		await Mongoose.connect(URI);

		Startup(client);
	} catch (error) {
		console.log(`Database error: ${error}`);
	}
};

Boot();
