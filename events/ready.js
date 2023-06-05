const { Events } = require('discord.js');

const execute = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute,
};
