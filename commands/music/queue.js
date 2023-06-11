const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Get the current queue');

const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  No music is currently playing`,
                iconURL: interaction.guild.iconURL()
            })
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray();
    tracks.unshift(currentTrack);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })
        .setThumbnail(currentTrack.thumbnail)
        .setTitle(`Queue - ${tracks.length} tracks - estimated time: ${queue.durationFormatted}`)
        .setDescription(`**Current Track - [${currentTrack.title}](${currentTrack.url})**`)
        .addFields(
            tracks.map((track, index) => ({
                name: `${index + 1}. ${track.title}`,
                value: `Requested by ${track.requestedBy?.username ?? 'Unknown'} | Duration: \`${track.duration}\` | [URL](${track.url})`
            }))
        )
        .setFooter({
            text: `Requested by ${interaction.member.user.username}`,
            iconURL: interaction.member.user.avatarURL()
        });


    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
