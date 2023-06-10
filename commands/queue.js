const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Get the current queue');

const execute = async (interaction, client) => {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray();
    const currentTrack = queue.currentTrack;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })
        .setThumbnail(currentTrack.thumbnail)
        .setTitle(`Queue`)
        .setDescription(`**Current Track - [${currentTrack.title}](${currentTrack.url})**`)
        .addFields(
            tracks.map((track, index) => ({
                name: `${index + 1}. ${track.title}`,
                value: `Requested by ${track.requestedBy.username}`
            }))
        )
        .setTimestamp();


    return interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
