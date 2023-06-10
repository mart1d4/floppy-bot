const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index.js');

const data = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Display information about a channel.')
    .addChannelOption((option) =>
        option.setName('channel').setDescription('The channel to display (defaults to current channel).')
    );

const execute = async (interaction) => {
    const channel =
        interaction.options.getChannel('channel') ?? interaction.channel;

    const messageCount = channel.messages.cache.length ?? 0;
    const createdAt = channel.createdTimestamp ?? Date.now();
    const textChannels = [
        0, 1, 3, 5, 10, 11, 12, 15
    ];

    const embed = new EmbedBuilder()
        .setTitle('Channel')
        .setDescription(channel.name ? `<#${channel.id}>` : `DM Channel | ${client?.user?.username}`)
        .addFields(
            { name: 'ID', value: `\`${channel.id}\``, inline: false },
            { name: 'Created at', value: `<t:${Math.floor(createdAt / 1000)}:d>`, inline: true },
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
            { name: 'Category name', value: channel.parent?.name ?? 'This channel doesn\'t have a category', inline: false },
            { name: 'Message count', value: toString(messageCount), inline: true },
        )
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
        })

    await interaction.reply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
