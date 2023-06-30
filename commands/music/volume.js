import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Change the volume of the music player')
    .addIntegerOption((option) =>
        option
            .setName('percentage')
            .setDescription('The volume you want to set')
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
    )
    .setDMPermission(false);

export const execute = (interaction) => {
    const volume = interaction.options.getInteger('percentage', true);

    if (!interaction.member?.voice?.channel || volume < 0 || volume > 100) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  You must be in a voice channel to use this command',
                iconURL: interaction.guild.iconURL()
            })
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

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
