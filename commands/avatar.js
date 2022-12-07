const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar")
    .addUserOption((option) =>
        option.setName('target').setDescription("The user's avatar to display")
    );

const execute = async (interaction) => {
    const user = interaction.options.getUser('target') ?? interaction.user;

    const pngURL = user.displayAvatarURL({ format: 'png', dynamic: true });
    const jpgURL = user.displayAvatarURL({ format: 'jpg', dynamic: true });
    const webpURL = user.displayAvatarURL({ format: 'webp', dynamic: true });
    const gifURL = user.displayAvatarURL({ format: 'gif', dynamic: true });
    const isGif = user
        .displayAvatarURL({ format: 'gif', dynamic: true })
        .endsWith('.gif');

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.avatarURL(),
        })
        .setTitle('Avatar Link')
        .setURL(user.avatarURL({ dynamic: true }))
        .setImage(user.avatarURL({ dynamic: true }))
        .setFields({
            name: 'Formats',
            value: `${hyperlink('PNG', pngURL)} • ${hyperlink(
                'JPG',
                jpgURL
            )} • ${hyperlink('WEBP', webpURL)} • ${
                isGif ? hyperlink('GIF', gifURL) : ''
            }`,
        })
        .setFooter({
            text: `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor('0x5E81AC');

    await interaction.reply({ embeds: [embed] });
};

module.exports = {
    data,
    execute,
};
