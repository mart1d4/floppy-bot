const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track')
    .addIntegerOption(option =>
        option
            .setName('number')
            .setDescription('The amount of tracks to skip')
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false)
    );

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

    const tracks = interaction.options.getInteger('number') ?? 1;
    for (let i = 0; i < tracks; i++) {
        queue.node.skip();
    }

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
