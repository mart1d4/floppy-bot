const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Display information about a channel.')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to display (defaults to current channel).')
    );

const execute = async (interaction) => {
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    const textChannels = [0, 1, 3, 5, 10, 11, 12, 15];

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `#${channel.name}`,
            iconURL: interaction.client.user.avatarURL(),
        })
        .setThumbnail(interaction.guild.iconURL())
        .setTitle('Channel information')
        .setDescription(`**Channel id: \`${channel.id}\` | Name: ${channel.name ? `<#${channel.id}>**` : `DM Channel - ${interaction.client.user.username}**`}`)
        .addFields(
            { name: 'Created', value: time(channel.createdAt, 'R'), inline: true },
            {
                name: 'Type',
                value: textChannels.includes(channel.type) ? 'Text' : 'Voice',
                inline: true,
            },
            {
                name: 'NSFW',
                value: channel.nsfw ? 'Yes' : 'No',
                inline: true,
            },
            { name: 'Topic', value: channel.topic ?? 'No topic set', inline: false },
            { name: 'Category', value: channel.parent?.name ?? 'This channel doesn\'t have a category', inline: false },
        )
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
