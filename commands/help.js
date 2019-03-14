const Discord = require("discord.js");

/**
 * @param {string[]} arguments The arguments to verify
 * @returns {?string} Returns nothing if argument is correct
 */
function verifyArguments(arguments) {
    if (arguments.length > 1) return "Too many arguments";
}

exports.info = {
    name: "Help",
    description: "Prints a list of commands",
    arguments: [
        {
            name: "Command name",
            description: "Provide a command's name to get a detailed description",
            optional: true
        }
    ]
}

async function help(message, args) {
    const error = verifyArguments(args);
    if (error) {
        const errMessage = await message.channel.send(error);
        errMessage.delete(5000);
        return;
    }

    const embed = new Discord.RichEmbed();
    message.client.commands.forEach((cmd, cmdName) => {
        if (cmd.info.hidden) return;
        if (embed.fields.some(el => el.name === cmd.info.name)) return;

        let aliases = cmd.info.aliases;
        if (aliases) aliases.unshift(cmdName);
        else aliases = [cmdName];

        embed.addField(cmd.info.name, cmd.info.description + "\nAliases: " + aliases.join(", "));
    });

    message.channel.send(embed);
}

exports.run = help;