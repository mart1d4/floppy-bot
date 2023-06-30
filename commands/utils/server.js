import { SlashCommandBuilder, EmbedBuilder, time } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.')
    .setDMPermission(false);

export const execute = async (interaction) => {
    if (!interaction.guild || !interaction.guild.available) {
        // Guild outage
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  Server is unavailable',
                iconURL: interaction.client.user.avatarURL(),
            })
            .setColor(0x5865F2);

        return interaction.reply({ embeds: [embed] });
    }

    const channels = interaction.guild.channels.cache;
    const members = interaction.guild.members.cache;

    const textIndexes = [0, 1, 3, 5, 10, 11, 12, 15];
    const textChannels = channels.filter(channel => textIndexes.includes(channel.type));
    const voiceChannels = channels.filter(channel => !textIndexes.includes(channel.type));

    const realMembers = members.filter(member => !member.user.bot);
    const bots = members.filter(member => member.user.bot);
    const onlineRealMembers = realMembers.filter(member => member.presence);
    const onlineBots = bots.filter(member => member.presence);

    const roles = [...interaction.guild.roles.cache.values()];
    const half = Math.ceil(roles.length / 2);
    const rolesFirstHalf = roles.slice(0, half);
    const rolesSecondHalf = roles.slice(half, roles.length);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
        })
        .setTitle('Server Information')
        .setDescription(`**Server id: \`${interaction.guildId}\` | Owner: <@${interaction.guild.ownerId}>**`)
        .addFields(
            { name: 'Created', value: time(interaction.guild.createdAt, 'R'), inline: true },
            { name: 'Emojis', value: `\`${interaction.guild.emojis.cache.size}\``, inline: true },
            { name: 'Stickers', value: `\`${interaction.guild.stickers.cache.size}\``, inline: true },
            {
                name: 'Members',
                value: `
                Total: \`${interaction.guild.memberCount}\`
                Real: \`${realMembers.size}\`
                Bots: \`${bots.size}\`
                `,
                inline: true
            },
            {
                name: 'Online',
                value: `
                Total: \`${onlineRealMembers.size + onlineBots.size}\`
                Real: \`${onlineRealMembers.size}\`
                Bots: \`${onlineBots.size}\`
                `,
                inline: true
            },
            {
                name: 'Channels',
                value: `
                Text: \`${textChannels.size}\`
                Voice: \`${voiceChannels.size}\`
                `,
                inline: true
            },
            {
                name: 'Roles',
                value: `${rolesFirstHalf.map((role) => `\n${role}`).join(' ') ?? 'No roles'}`,
                inline: true
            },
            {
                name: '\u200B',
                value: `${rolesSecondHalf.map((role) => `\n${role}`).join(' ') ?? 'No roles'}`,
                inline: true
            },
        )
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.avatarURL(),
        })
        .setColor(0x5865F2);

    return interaction.reply({ embeds: [embed] });
};
