const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { usePlayer, useMasterPlayer } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music for you')
    .addStringOption((option) =>
        option
            .setName('song')
            .setDescription('The song you want to play')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(true)
    );

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('You are not connected to a voice channel!');
    const query = interaction.options.getString('song', true);

    const player = useMasterPlayer();
    const guildPlayer = usePlayer(interaction.guild.id);

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                metadata: interaction
            }
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL()
            })
            .setThumbnail(track.thumbnail)
            .setTitle('Now Playing')
            .setDescription(`[${track.title}](${track.url})`)
            .addFields(
                { name: 'Duration', value: `\`${track.duration}\``, inline: true },
                // { name: 'Queue', value: `\`${guildPlayer.getTrackPosition(track)}\``, inline: true },
                { name: 'Volume', value: `\`${guildPlayer.volume}%\``, inline: true },
                { name: 'Requester', value: `<@${interaction.member.id}>`, inline: false },
            );

        interaction.deleteReply();
        return interaction.channel.send({ embeds: [embed] });
    } catch (e) {
        return interaction.followUp(`Something went wrong: ${e}`);
    }
};

module.exports = {
    data: data,
    execute: execute,
};
