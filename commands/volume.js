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

    const queue = useQueue(interaction.guild.id);
    queue.node.setVolume(volume);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })
        .setTitle('Music Player')
        .setDescription(`Volume set to \`${volume}%\``);

    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
