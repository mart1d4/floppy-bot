const { Events, EmbedBuilder } = require('discord.js');

const sendMessage = async (client, message) => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    const embed = new EmbedBuilder()
        .setTitle(`Message from ${client.user.username}`)
        .setDescription(message)
        .setColor('0x5E81AC');
    channel.send({ embeds: [embed] });
};

const execute = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    // await sendMessage(client, `I woke up!`);
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute,
};
