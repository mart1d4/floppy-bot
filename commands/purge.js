const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
} = require('discord.js');
const {
    userHasPermission,
    userHasChannelPermission,
} = require('../utils/permissions.js');

const timout = process.env.TIMEOUT;

const data = new SlashCommandBuilder()
    .setName('purge')
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
            .addChannelTypes(ChannelType.GuildText)
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
    const user = options.getUser('user') ?? null;
    const all = options.getBoolean('all') ?? false;

    if (
        (!userHasPermission(
            interaction.member,
            PermissionsBitField.Flags.ManageMessages
        ) ||
            !userHasChannelPermission(
                interaction.member,
                channel,
                PermissionsBitField.Flags.ManageMessages
            )) &&
        (user == null || (user != null && user.id != interaction.member.id))
    ) {
        // User doesn't have permission to delete messages and isn't deleting their own messages
        i = -1;
    } else if (
        !userHasChannelPermission(
            interaction.member,
            channel,
            PermissionsBitField.Flags.ViewChannel
        )
    ) {
        // User doesn't have permission to view the channel
        i = -2;
    } else if (channel.type == ChannelType.GuildVoice) {
        // Channel is a voice channel
        i = -3;
    } else if (
        all &&
        !userHasPermission(
            interaction.member,
            PermissionsBitField.Flags.Administrator
        )
    ) {
        // User doesn't have permission to delete all messages
        i = -4;
    } else if (all) {
        // Delete all messages by cloning the channel and deleting the old one
        newChannel = await channel.clone();
        await channel.delete();
        i = -5;
    } else {
        while (amount - i >= 100) {
            const messages = await channel.messages.fetch({ limit: 100 });
            if (user == null) {
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
            if (user == null) {
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
    }

    const embed = new EmbedBuilder()
        .setTitle(-5 < i && i <= 0 ? 'Purge Failed' : 'Purge Successful')
        .setDescription(
            -5 <= i && i <= 0
                ? i == 0
                    ? 'There was no messages to delete'
                    : i == -1
                    ? "You don't have permission to delete messages"
                    : i == -2
                    ? "You don't have permission to view the channel"
                    : i == -3
                    ? "You can't delete messages from a voice channel"
                    : i == -4
                    ? 'You need to be an administrator to delete all messages'
                    : 'All messages successfully deleted'
                : `Deleted ${amount} message${amount > 1 ? 's' : ''} ${
                      user ? `by <@${user.id}>` : ''
                  } in ${channel}`
        )
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
        })
        .setTimestamp()
        .setColor(-5 < i && i <= 0 ? '0xED4245' : '0x57F287');

    if (i == -5) {
        if (channel == interaction.channel) {
            await newChannel.send({ embeds: [embed] });
        } else {
            await newChannel.send({ embeds: [embed] });
            embed.setDescription(
                `Successfully deleted all messages in ${newChannel}.`
            );
            await interaction.editReply({ embeds: [embed] });
            setTimeout(async () => {
                await interaction.deleteReply();
            }, timout);
        }
    } else {
        await interaction.editReply({ content: 'Loading...' });
        await interaction
            .followUp({ embeds: [embed], ephemeral: false })
            .then(async (message) => {
                await interaction.deleteReply();
                setTimeout(async () => {
                    await message.delete();
                }, timout);
            });
    }
};

module.exports = {
    data,
    execute,
};
