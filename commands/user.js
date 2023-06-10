const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Displays info about a user')
    .addUserOption((option) =>
        option.setName('target').setDescription("The user's info to display")
    );

const execute = async (interaction) => {
    const user = interaction.options.getUser('target') ?? interaction.user;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.avatarURL(),
        })
        .setTitle('User Info')
        .setThumbnail(user.avatarURL())
        .addFields(
            { name: 'ID', value: user.id, inline: false },
            { name: 'Username', value: user.username, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Tag', value: user.discriminator, inline: true },
            {
                name: 'Joined Discord',
                value: time(user.createdAt, 'R'),
                inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            interaction?.guild?.members?.cache?.get(user.id).joinedAt && {
                name: 'Joined Server',
                value: time(
                    interaction.guild.members.cache.get(user.id).joinedAt,
                    'R'
                ),
                inline: true,
            }
        )
        .setFooter({
            text: `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor('0x5E81AC');

    await interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
