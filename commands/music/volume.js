const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Change the volume of the player')
    .addIntegerOption((option) =>
        option
            .setName('percentage')
            .setDescription('The volume you want to set')
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
    );

const execute = (interaction) => {
    const volume = interaction.options.getInteger('percentage', true);

    const queue = interaction.guild ? useQueue(interaction.guild.id) : null;
    const icon = interaction.guild ? interaction.guild.iconURL() : interaction.client.user.avatarURL();

    if (!queue || !queue.isPlaying()) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  No music is currently playing',
                iconURL: icon
            })
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

    queue.node.setVolume(volume);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: icon
        })
        .setTitle('Music Player')
        .setDescription(`Volume set to \`${volume}%\``);

    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
