const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index.js').client;

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Displays the bot's latency");

const execute = async (interaction) => {
    const channel = interaction.channel;

    const sent = await interaction.reply({
        content: 'Pinging...',
        fetchReply: true,
        ephemeral: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
        .setTitle('Pong! 🏓')
        .setDescription('Latency: ' + '`' + latency + 'ms`')
        .setColor(
            latency < 150 ? 0x57f287 : latency < 300 ? 0xfee75c : 0xed4245
        );

    await interaction.deleteReply();
    await channel.send({ embeds: [embed] });
};

module.exports = {
    data,
    execute,
};
