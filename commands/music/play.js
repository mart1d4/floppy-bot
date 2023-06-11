const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { usePlayer, useMasterPlayer, useQueue } = require("discord-player");

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

    if (!channel) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  You are not connected to a voice channel',
                iconURL: interaction.guild.iconURL()
            })
            .setColor(0xFEE75C);

        return interaction.followUp({ embeds: [embed] });
    }

    const query = interaction.options.getString('song', true);

    const player = useMasterPlayer();

    try {
        await player.play(channel, query, {
            nodeOptions: {
                metadata: interaction
            }
        });

        return interaction.deleteReply();
    } catch (e) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '**|  Something went wrong**',
                iconURL: interaction.client.user.avatarURL()
            })
            .setColor(0xED4245);

        return interaction.followUp({ embeds: [embed] });
    }
};

module.exports = {
    data: data,
    execute: execute,
};
