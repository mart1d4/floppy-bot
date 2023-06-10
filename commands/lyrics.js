const { lyricsExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { useQueue } = require("discord-player");

const data = new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics of the current playing song, or a song of your choice')
    .addStringOption(option => option.setName('song').setDescription('The song to get lyrics for').setRequired(false));

const execute = async (interaction) => {
    await interaction.deferReply();

    const song = interaction.options.getString('song') ?? null;
    const queue = useQueue(interaction.guild.id);
    const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);

    if (!song && !queue?.currentTrack) {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription('No song is currently playing')
            .setColor(0xED4245);

        return interaction.followUp({ embeds: [embed] });
    }

    const lyrics = await lyricsFinder.search(
        song ?? queue.currentTrack.title,
    ).catch((e) => {
        console.log(e);
        return null;
    });

    if (!lyrics) {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription('No lyrics found')
            .setColor(0xED4245);

        return interaction.followUp({ embeds: [embed] });
    }

    const trimmedLyrics1 = lyrics.lyrics.substring(0, 1997);
    const trimmedLyrics2 = lyrics.lyrics.substring(1997, 3994);

    const embed = new EmbedBuilder()
        .setTitle(lyrics.title)
        .setURL(lyrics.url)
        .setThumbnail(lyrics.thumbnail)
        .setAuthor({
            name: lyrics.artist.name,
            iconURL: lyrics.artist.image,
            url: lyrics.artist.url
        })
        .setDescription(trimmedLyrics1.length === 1997 ? `${trimmedLyrics1}...` : trimmedLyrics1)
        .setColor(0x5865F2);

    if (trimmedLyrics1.length === 1997) {
        const previous = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(previous, next);

        const response = await interaction.followUp({ embeds: [embed], components: [row] });

        try {
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 3_600_000
            });

            collector.on('collect', async (button) => {
                if (button.customId === 'previous') {
                    const embed = new EmbedBuilder()
                        .setTitle(lyrics.title)
                        .setURL(lyrics.url)
                        .setThumbnail(lyrics.thumbnail)
                        .setAuthor({
                            name: lyrics.artist.name,
                            iconURL: lyrics.artist.image,
                            url: lyrics.artist.url
                        })
                        .setDescription(trimmedLyrics1.length === 1997 ? `${trimmedLyrics1}...` : trimmedLyrics1)
                        .setColor(0x5865F2);

                    const previous = new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous Page')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    const next = new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next Page')
                        .setStyle(ButtonStyle.Secondary);

                    const row = new ActionRowBuilder()
                        .addComponents(previous, next);

                    await interaction.editReply({ embeds: [embed], components: [row] });
                } else if (button.customId === 'next') {
                    const embed = new EmbedBuilder()
                        .setTitle(lyrics.title)
                        .setURL(lyrics.url)
                        .setThumbnail(lyrics.thumbnail)
                        .setAuthor({
                            name: lyrics.artist.name,
                            iconURL: lyrics.artist.image,
                            url: lyrics.artist.url
                        })
                        .setDescription(trimmedLyrics2.length === 1997 ? `${trimmedLyrics2}...` : trimmedLyrics2)
                        .setColor(0x5865F2);

                    const previous = new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous Page')
                        .setStyle(ButtonStyle.Secondary);

                    const next = new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next Page')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    const row = new ActionRowBuilder()
                        .addComponents(previous, next);

                    await interaction.editReply({ embeds: [embed], components: [row] });
                }

                await button.deferUpdate();
            });
        } catch (e) {
            console.log(e);
        }
    } else {
        return interaction.followUp({ embeds: [embed] });
    }
};

module.exports = {
    data: data,
    execute: execute,
};
