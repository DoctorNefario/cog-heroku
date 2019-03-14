const Discord = require("discord.js");

/**
 * @param {string[]} arguments The arguments to verify
 * @returns {?string} Returns nothing if argument is correct
 */
function verifyArguments(arguments) {
    if (arguments.length < 1) return "Not enough arguments";
}

exports.info = {
    name: "Evaluate",
    description: "Evaluates any given code (only usable by my creator)",
    arguments: [
        {
            name: "Code",
            description: "The code to evaluate",
            optional: false
        }
    ],
    hidden: true
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