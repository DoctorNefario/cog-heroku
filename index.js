const Discord = require("discord.js");
const keys = require("./keys");
const config = require("./config");

const { commands } = require("./commands/");

const client = new Discord.Client();

function commandHandler(msg) {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(config.prefix)) return;
	// I don't want to have an empty command
	if (msg.content.startsWith(config.prefix + " ")) return;

	// Split arguments with a space, and remove an empty strings
	const args = msg.content.split(" ").filter(arg => arg.length > 0);
	// Take the first argument out and remove the prefix
	const commandName = args.shift().substr(config.prefix.length);

	const command = commands.get(commandName);
	if (command == null) return;

	command.run(msg, args);
}

client.on('message', commandHandler);

client.on('ready', () => {
	console.log("Bot is now online!");
});

client.login(keys.botToken).catch(console.error);
