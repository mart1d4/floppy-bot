const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const { useMasterPlayer } = require("discord-player");
const { Events } = require("discord.js");

const execute = async (client) => {
    const player = useMasterPlayer();

    await player.extractors.register(SpotifyExtractor, {});
    console.log(`Logged in as ${client.user.tag}!`);
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute,
};
