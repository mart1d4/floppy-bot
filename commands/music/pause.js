const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the music')

const execute = (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  No music is currently playing',
                iconURL: interaction.guild.iconURL()
            })
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

    queue.node.setPaused(!queue.node.isPaused());

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })
        .setTitle('Music Player')
        .setDescription(`Player is now ${queue.node.isPaused() ? 'paused' : 'resumed'}.`);

    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
