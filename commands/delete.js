const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
} = require('discord.js');
const {
    userHasPermission,
    userHasChannelPermission,
} = require('../lib/permissions.js');

const timout = process.env.TIMEOUT;

const data = new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes the specified number of messages')
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('The number of messages to delete')
            .setMinValue(1)
            .setMaxValue(500)
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription(
                'The channel to delete messages from. Defaults to the current channel.'
            )
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildForum,
                ChannelType.GuildAnnouncement,
                ChannelType.AnnouncementThread,
                ChannelType.PrivateThread,
                ChannelType.PublicThread,
            )
            .setRequired(false)
    )
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription(
                'The user to delete messages from. Defaults to all users.'
            )
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName('all')
            .setDescription(
                'Whether or not to delete all messages in the channel. Only deletes messages by a user if specified.'
            )
            .setRequired(false)
    );

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    let i = 0;
    let newChannel = null;
    const options = interaction.options;
    let amount = options.getInteger('amount');
    const channel = options.getChannel('channel') ?? interaction.channel;
    const isDM = channel.type == 1;
    const user = options.getUser('user') ?? null;
    const all = options.getBoolean('all') ?? false;

    const sendError = (error) => {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(error)
            .setColor(0xED4245);

        interaction.editReply({ embeds: [embed] });
    };

    const sendSuccess = (message) => {
        const embed = new EmbedBuilder()
            .setTitle('Success')
            .setDescription(message)
            .setColor(0x57F287);

        interaction.editReply({ embeds: [embed] });
    };

    if (isDM) {
        sendError('You cannot delete messages in a DM.');
        return;
    }

    if (all) {
        if (isDM) {
            sendError('You cannot delete all messages in a DM.');
            return;
        } else if (user) {
            sendError('You cannot delete all messages by a user.');
            return;
        }

        if (!userHasPermission(interaction.member, PermissionsBitField.ManageMessages)) {
            sendError('You do not have permission to delete messages.');
            return;
        }

        newChannel = await channel.clone();
        await channel.delete();

        sendSuccess(`Successfully deleted all messages in ${newChannel}.`);
        return;
    }

    if (!isDM) {
        if (!userHasPermission(interaction.member, PermissionsBitField.ManageMessages)) {
            sendError('You do not have permission to delete messages.');
            return;
        }
    }

    while (amount - i >= 100) {
        const messages = await channel.messages.fetch({ limit: 100 });

        if (!user) {
            if (messages.size < 100) {
                amount = i + messages.size;
            }

            i += (await channel.bulkDelete(messages)).size;
        } else {
            const filteredMessages = messages.filter(
                (message) => message.author.id == user.id
            );

            if (filteredMessages.size == 0) {
                amount = i;
                break;
            }

            i += (await channel.bulkDelete(filteredMessages)).size;
        }
    }

    while (amount - i > 0) {
        if (!user) {
            const messages = await channel.messages.fetch({
                limit: amount - i,
            });

            if (messages.size < amount - i) {
                amount = i + messages.size;
            }

            i += (await channel.bulkDelete(messages)).size;
        } else {
            let filteredMessages;

            await channel.messages
                .fetch({
                    limit: 100,
                })
                .then((messages) => {
                    filteredMessages = messages
                        .filter((m) => m.author.id === user.id)
                        .array()
                        .slice(0, amount - i);
                });

            if (filteredMessages.size == 0) {
                amount = i;
                break;
            }

            i += (await channel.bulkDelete(filteredMessages)).size;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Successfully deleted ${amount} messages.`)
        .setColor(0x57F287);

    interaction.editReply({ embeds: [embed] });
};

module.exports = {
    data: data,
    execute: execute,
};
