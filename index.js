const Discord = require("discord.js");
const keys    = require("./keys");

const client = new Discord.Client();

client.on('ready', () => {
	console.log("Bot is now online!");
});

client.login(keys.botToken).catch(console.error);
