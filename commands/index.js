const { Collection } = require("discord.js");

exports.commands = new Collection();

const { join } = require('path');

const cmdPaths = require("fs").readdirSync(__dirname);
cmdPaths.splice(cmdPaths.indexOf("index.js"), 1);

for (file of cmdPaths) {
    const command = require(join(__dirname, file));
    exports.commands.set(file.substring(0, file.indexOf('.')), command);
    for (alias of command.info.aliases) exports.commands.set(alias, command);
};
