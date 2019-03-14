const Discord = require("discord.js");
const config = require("./config");


const client = new Discord.Client();

client.commands = require("./commands/").commands;

client.botDeletedMessages = [];

client.botDelete = async (msg, waitTime = 0) => {
	client.botDeletedMessages.push(msg.id);
	return msg.delete(waitTime);
}

/* Handlers */
async function commandHandler(msg) {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(config.prefix)) return;
	// I don't want to have an empty command
	if (msg.content.startsWith(config.prefix + " ")) return;

	// Split arguments with a space, and remove an empty strings
	const args = msg.content.split(" ").filter(arg => arg.length > 0);
	// Take the first argument out and remove the prefix
	const commandName = args.shift().substr(config.prefix.length);

	const command = client.commands.get(commandName);
	if (command == null) return;

	command.run(msg, args);
}

async function editHandler(oldMsg, newMsg) {
	if (oldMsg.author.bot) return;
	if (oldMsg.guild.id !== config.guildID) return;
	const editChannel = client.channels.get(config.editChannel);
	const embed = new Discord.RichEmbed();
	embed.setAuthor(newMsg.author.tag, newMsg.author.avatarURL, "");
	embed.setDescription(`Edited a [message](${newMsg.url}) in ${newMsg.channel}`);
	embed.addField("Old message", "```" + oldMsg.cleanContent.replace("`", "'") + "```", true);
	embed.addField("New message", "```" + newMsg.cleanContent.replace("`", "'") + "```", true);
	editChannel.send(embed);
}

async function deleteHandler(delMsg) {
	if (delMsg.author.bot) return;
	if (delMsg.guild.id !== config.guildID) return;

	const deletedIndex = client.botDeletedMessages.indexOf(delMsg.id);
	if (deletedIndex >= 0) {
		client.botDeletedMessages = client.botDeletedMessages.splice(deletedIndex, 1);
		return;
	}
	
	const deletedChannel = client.channels.get(config.deletedChannel);
	const embed = new Discord.RichEmbed();
	embed.setAuthor(delMsg.author.tag, delMsg.author.avatarURL, "");
	embed.setDescription(`Deleted a message from ${delMsg.channel}`);
	embed.addField("Message", "```" + delMsg.cleanContent.replace("`", "'") + "```");
	deletedChannel.send(embed);
}

async function rawReactionHandler(event) {
	if (event.t !== "MESSAGE_REACTION_ADD" && event.t !== "MESSAGE_REACTION_REMOVE") return;
	if (event.d.message_id !== config.roleMessage) return;
	if (event.d.guild_id !== config.guildID) return;

	const channel = await client.channels.get(event.d.channel_id);
	const message = await channel.fetchMessage(event.d.message_id);
	const member = await message.guild.members.get(event.d.user_id);
	if (member.user.bot) return;

	const emojiName = event.d.emoji.id || event.d.emoji.name;

	const roleData = config.roles[emojiName];
	if (event.t === "MESSAGE_REACTION_ADD") {
		if (!roleData) {
			message.reactions.get(emojiName).remove(member);
			return;
		}
		const role = message.guild.roles.get(roleData.id);
		member.addRole(role, config.roleAddReason).catch(() => { });
	} else {
		if (!roleData) return;
		if (!roleData.removable) {
			client.channels.get(config.miscChannel).send(`${member.user} attempted to remove an unremovable role`);
			return;
		}

		const role = message.guild.roles.get(roleData.id);
		member.removeRole(role, config.roleRemoveReason).catch(() => { });
	}
}

async function rawReactDeleteHandler(event) {
	if (event.t !== "MESSAGE_REACTION_ADD") return;
	if (event.d.guild_id !== config.guildID) return;
	if ((event.d.emoji.id || event.d.emoji.name) !== config.deleteEmoji) return;

	const guild = client.guilds.get(event.d.guild_id);
	const deletedChannel = client.channels.get(event.d.channel_id);

	const logChannel = client.channels.get(config.deletedChannel);
	const embed = new Discord.RichEmbed();

	const delMsg = await deletedChannel.fetchMessage(event.d.message_id);
	const deleteStaff = guild.members.get(event.d.user_id);

	if (!deleteStaff.roles.has(config.staffID)) {
		delMsg.reactions.get(event.d.emoji.id).remove(deleteStaff);
		deletedChannel.send(`${deleteStaff}, you are not allowed to use that emoji`).then(msg => msg.delete(5000));
		const miscChannel = client.channels.get(config.miscChannel);
		miscChannel.send(`${deleteStaff} attempted to delete ${delMsg.author}'s message in ${deletedChannel}`)
		return;
	}

	embed.setAuthor(delMsg.author.tag, delMsg.author.avatarURL, "");
	embed.setDescription(`Deleted a message from ${delMsg.channel}`);
	embed.addField("Message", "```" + delMsg.cleanContent.replace("`", "'") + "```");
	embed.addField("Deleted by:", deleteStaff);
	logChannel.send(embed);

	client.botDelete(delMsg);
}

async function readyHandler() {
	console.log("Bot is now online!");

	const roleChannel = client.channels.get(config.roleChannel);
	const roleMessage = await roleChannel.fetchMessage(config.roleMessage);


	for (r in config.roles) roleMessage.react(r);

	let roleEmbedText = "";

	roleMessage.reactions.forEach(async reaction => {
		const emoji = reaction.emoji.id || reaction.emoji.name;
		const role = config.roles[emoji];
		if (role) {
			reaction.users.forEach(user => user.addRole(role.id));
			roleEmbedText += `${reaction.emoji} to get role ${roleMessage.guild.roles.get(role.id)}\n`
		} else {
			await reaction.fetchUsers();
			reaction.users.forEach(u => reaction.remove(u));
		}
	});

	const embed = new Discord.RichEmbed();
	embed.addField("Roles", roleEmbedText);
	roleMessage.edit(config.roleContent, embed);
}

/* Events */
client.on('message', commandHandler);
client.on('messageUpdate', editHandler);
client.on('messageDelete', deleteHandler);
client.on('raw', rawReactionHandler);
client.on('raw', rawReactDeleteHandler);
client.on('ready', readyHandler);

client.login(process.env.DISCORD_TOKEN).catch(console.error);
