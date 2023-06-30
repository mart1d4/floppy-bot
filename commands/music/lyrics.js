import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from 'discord.js';
import { lyricsExtractor } from '@discord-player/extractor';
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics for the current song, or a song of your choice')
    .addStringOption((option) =>
        option
            .setName('song')
            .setDescription('The song to get lyrics for')
            .setRequired(false)
    );

export const execute = async (interaction) => {
    const song = interaction.options.getString('song') ?? null;
    const queue = useQueue(interaction.guild?.id);
    const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);

    const icon = interaction.guild ? interaction.guild.iconURL() : interaction.client.user.avatarURL();

    if (!song && !queue?.currentTrack) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  No music is currently playing',
                iconURL: icon
            })
            .setDescription('You can specify a song to get lyrics for.')
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply();

    const lyrics = await lyricsFinder.search(
        song ?? queue.currentTrack.title,
    ).catch((e) => {
        console.log(e);
        return null;
    });

    if (!lyrics) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  No lyrics found for this song',
                iconURL: icon
            })
            .setColor(0xFEE75C);

        return interaction.editReply({ embeds: [embed] });
    }

    const charLimit = 2000 - 3;
    const strings = [];

    for (let i = 0; i < lyrics.lyrics.length; i += charLimit) {
        strings.push(lyrics.lyrics.substring(i, i + charLimit));
    }

    let index = 0;

    const embed = new EmbedBuilder()
        .setTitle(lyrics.title)
        .setURL(lyrics.url)
        .setThumbnail(lyrics.thumbnail)
        .setAuthor({
            name: lyrics.artist.name,
            iconURL: lyrics.artist.image,
            url: lyrics.artist.url
        })
        .setDescription(index === strings.length - 1 ? strings[index] : `${strings[index]}...`)
        .setColor(0x5865F2);

    if (strings.length > 1) {
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

        const response = await interaction.editReply({ embeds: [embed], components: [row] });

        try {
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 3_600_000
            });

            collector.on('collect', async (button) => {
                if (button.customId === 'previous') {
                    index--;
                } else if (button.customId === 'next') {
                    index++;
                }

                const newEmbed = EmbedBuilder.from(embed).setDescription(
                    index === strings.length - 1 ? strings[index] : `${strings[index]}...`
                );

                const button1 = ButtonBuilder.from(previous).setDisabled(index === 0);
                const button2 = ButtonBuilder.from(next).setDisabled(index === strings.length - 1);

                const row = new ActionRowBuilder().addComponents(button1, button2);

                await interaction.editReply({ embeds: [newEmbed], components: [row] });
                await button.deferUpdate();
            });
        } catch (e) {
            console.log(e);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: '|  An error occurred',
                    iconURL: interaction.guild.iconURL()
                })
                .setDescription('An error occurred while trying to paginate the lyrics.')
                .setColor(0xED4245);

            return interaction.editReply({ embeds: [embed], components: [] });
        }
    } else {
        return interaction.followUp({ embeds: [embed] });
    }
};
