import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar")
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription(
                "The user's avatar to display. Defaults to you."
            )
    );

export const execute = async (interaction) => {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const avatar = user.displayAvatarURL({ size: 1024 });
    const pngURL = user.displayAvatarURL({ extension: 'png' });
    const jpgURL = user.displayAvatarURL({ extension: 'jpg' });
    const webpURL = user.displayAvatarURL({ extension: 'webp' })
    const gifURL = user.displayAvatarURL({ extension: 'gif' });
    const isGif = user.displayAvatarURL({ extension: 'gif' }).endsWith('.gif');

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Avatar for ${user.username}`,
            iconURL: avatar,
        })
        .setTitle('Avatar Link')
        .setURL(avatar)
        .setImage(avatar)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor(0x5865F2);

    const firstRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('PNG')
                .setStyle(ButtonStyle.Link)
                .setURL(pngURL)
        )
        .addComponents(
            new ButtonBuilder()
                .setLabel('JPG')
                .setStyle(ButtonStyle.Link)
                .setURL(jpgURL)
        )
        .addComponents(
            new ButtonBuilder()
                .setLabel('WEBP')
                .setStyle(ButtonStyle.Link)
                .setURL(webpURL)
        )
        .addComponents(
            new ButtonBuilder()
                .setLabel('GIF')
                .setStyle(ButtonStyle.Link)
                .setURL(gifURL)
                .setDisabled(!isGif)
        );

    await interaction.reply({
        embeds: [embed],
        components: [firstRow],
    });
};
