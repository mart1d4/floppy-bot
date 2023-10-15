import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current track")
    .addIntegerOption((option) =>
        option
            .setName("number")
            .setDescription("The amount of tracks to skip")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false)
    )
    .setDMPermission(false);

export const execute = (interaction) => {
    if (!interaction.member?.voice?.channel) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "|  You must be in a voice channel to use this command",
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0xfee75c);

        return interaction.reply({ embeds: [embed] });
    }

    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "|  No music is currently playing",
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0xfee75c);

        return interaction.reply({ embeds: [embed] });
    }

    const tracks = interaction.options.getInteger("number") ?? 1;
    for (let i = 0; i < tracks; i++) {
        queue.node.skip();
    }

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
        })
        .setTitle("Music Player")
        .setDescription(tracks === 1 ? `Skipped the current track` : `Skipped ${tracks} tracks`);

    return interaction.reply({ embeds: [embed] });
};
