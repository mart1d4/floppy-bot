const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar")
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription(
                "The user's avatar to display. Defaults to the command's executor."
            )
    );

const execute = async (interaction) => {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const avatar = user.displayAvatarURL();
    const pngURL = user.displayAvatarURL({ format: 'png' });
    const jpgURL = user.displayAvatarURL({ format: 'jpg' });
    const webpURL = user.displayAvatarURL({ format: 'webp' });
    const gifURL = user.displayAvatarURL({ format: 'gif' });
    const isGif = user.displayAvatarURL({ format: 'gif' }).endsWith('.gif');

    const embed = new EmbedBuilder()
        .setAuthor({
            name: user.tag,
            iconURL: avatar,
        })
        .setTitle('Avatar Link')
        .setURL(avatar)
        .setImage(avatar)
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor('0x5865F2');

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
        );

    const secondRow = new ActionRowBuilder()
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
        components: [firstRow, secondRow],
    });
};

module.exports = {
    data,
    execute,
};
