const { Events } = require("discord.js");
const { useMasterPlayer } = require("discord-player");

const execute = async (client) => {
    const player = useMasterPlayer();

    await player.extractors.loadDefault();
    console.log(`Logged in as ${client.user.tag}!`);
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute,
};
