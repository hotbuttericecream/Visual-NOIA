/*
	This will load up the database and start up the bot
*/

const { Client, GatewayIntentBits } = require("discord.js");
const Mongoose = require("mongoose");
const Startup = require("./Core/Scripts/Startup");

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

(async () => {
	try {
		await Mongoose.connect(process.env.MONGODB_URI);

		Startup(client)
	} catch (error) {
		console.log(`Database error: ${error}`);
	}
})();
