const Discord = require("discord.js");

/**
 * @param {string[]} arguments The arguments to verify
 * @returns {?string} Returns nothing if argument is correct
 */
function verifyArguments(arguments) {
    if (arguments.length < 1) return "Not enough arguments";
}

exports.info = {
    name: "Mass delete",
    description: "Deletes up to 50 messages from the current channel",
    arguments: [
        {
            name: "Amount",
            description: "The amount of messages to delete",
            optional: false
        }
    ],
    aliases: [
        "purge"
    ]
}

async function msgEval(message, args) {
    if (message.author.tag !== "DrNefario#6964") return;
    const error = verifyArguments(args);
    if (error) {
        const errMessage = await message.channel.send(error);
        errMessage.delete(5000);
        return;
    }

    let toEval = message.content;
    toEval = toEval.substring(toEval.indexOf(" ") + 1);

    const result = eval(toEval);
    message.reply(result);
}

exports.run = msgEval;