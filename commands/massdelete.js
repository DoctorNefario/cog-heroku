const Discord = require("discord.js");

/**
 * @param {string[]} arguments The arguments to verify
 * @returns {?string} Returns nothing if argument is correct
 */
function verifyArguments(arguments) {
    if (arguments.length !== 1) return;
    const arg = arguments[0];
    if (isNaN(arg)) return "Please use a number";
    try {
        const num = new Number(arg);
        if (num % 1 !== 0) return "Number must be whole";
        if (num < 1 || num > 50) return "Number must be between 1 and 50";
    } catch (e) {
        console.error(e)
        return "Unknown error";
    }
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
/**
 * 
 * @param {Discord.Message} message 
 * @param {string[]} arguments 
 */
async function massDelete(message, arguments) {
    const error = verifyArguments(arguments);
    if (error) {
        const errMessage = await message.channel.send(error);
        errMessage.delete(5000);
    }

    await message.delete();

    const deleteAmount = new Number(arguments[0]);

    const deleted = await message.channel.bulkDelete(deleteAmount);
    const deleteCount = deleted.size;

    message.channel.send(`Deleted ${deleteCount} message${deleteCount === 1 ? '' : 's'}`).then(msg => msg.delete(5000));
}

exports.run = massDelete