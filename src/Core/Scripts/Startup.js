/*
	This will load everything that's needed
*/

const path = require("path");
const ConnectEventListeners = require("../Events/Scripts/ConnectEventListeners");
const AppEnum = require("../Enums/App");
require("dotenv").config();

///

const URI = AppEnum.IsTest ? process.env.TEST_TOKEN : process.env.TOKEN;

const CORE_EVENT_LISTENERS = path.join(__dirname, "..", "Events", "Listeners");
const XP_EVENT_LISTENERS = path.join(__dirname, "..", "..", "XP", "Events", "Listeners");
const SESSION_EVENT_LISTENERS = path.join(__dirname, "..", "..", "Session", "Events", "Listeners");

module.exports = (client) => {
	ConnectEventListeners(client, CORE_EVENT_LISTENERS);
	ConnectEventListeners(client, XP_EVENT_LISTENERS);
	ConnectEventListeners(client, SESSION_EVENT_LISTENERS);

	client.login(URI);
};
