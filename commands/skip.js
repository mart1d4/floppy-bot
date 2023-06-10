const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track');

const execute = (interaction) => {
    const queue = useQueue(interaction.guild.id);
    queue.node.skip()

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })
        .setTitle('Music Player')
        .setDescription(`Skipped the current track`);

    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
