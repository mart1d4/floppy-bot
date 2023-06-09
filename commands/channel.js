const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const index = require('../index.js');

const data = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Displays the channel information')
    .addChannelOption((option) =>
        option.setName('channel').setDescription('The channel to display')
    );

const execute = async (interaction) => {
    const channel =
        interaction.options.getChannel('channel') ?? interaction.channel;

    const messageCount = channel.messages.cache.map((x) => x).length;
    console.log(messageCount);

    const embed = new EmbedBuilder()
        .setTitle('Channel')
        .setDescription(`Channel: ${channel}`)
        .addFields(
            { name: 'ID', value: channel.id, inline: true },
            {
                name: 'Type',
                value: channel.type == 0 ? 'Text' : 'Voice',
                inline: true,
            },
            {
                name: 'NSFW',
                value: channel.nsfw ? 'Yes' : 'No',
                inline: true,
            },
            { name: 'Topic', value: channel.topic ?? 'None', inline: true },
            { name: 'Parent', value: channel.parent.name, inline: true }
        );

    await interaction.reply({ embeds: [embed] });
};

module.exports = {
    data,
    execute,
};
