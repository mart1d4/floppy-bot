const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes the specified number of messages')
    .addIntegerOption((option) =>
        option
            .setName('number')
            .setDescription('The number of messages to delete. Defaults to 1.')
            .setMinValue(1)
            .setMaxValue(500)
            .setRequired(false)
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    let i = 0;
    let newChannel = null;
    const options = interaction.options;
    let amount = options.getInteger('number') ?? 1;
    const channel = options.getChannel('channel') ?? interaction.channel;
    const isDM = channel.type == 1;
    const user = options.getUser('user') ?? null;
    const all = options.getBoolean('all') ?? false;

    const sendError = (error) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  Error - ${error}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0xED4245);

        interaction.editReply({ embeds: [embed] });
    };

    const sendSuccess = (message) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  ${message}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0x57F287);

        interaction.editReply({ embeds: [embed] });
    };

    if (isDM) {
        sendError('You cannot delete messages in a DM');
        return;
    }

    if (all) {
        if (isDM) {
            sendError('You cannot delete all messages in a DM');
            return;
        } else if (user) {
            sendError('You cannot delete all messages by a user');
            return;
        }

        newChannel = await channel.clone();
        await channel.delete();

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  Successfully deleted all messages in #${newChannel.name}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0x57F287);

        return newChannel.send({ embeds: [embed] });
    }

    try {
        while (amount - i >= 100) {
            const messages = await channel.messages.fetch({ limit: 100 });

            if (!user) {
                const numberDeleted = (await channel.bulkDelete(100)).size;

                if (numberDeleted < 100) {
                    amount = i + numberDeleted;
                }

                i += numberDeleted;
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
                const numberDeleted = (await channel.bulkDelete(amount - i)).size;

                if (numberDeleted < amount - i) {
                    amount = i + numberDeleted;
                }

                i += numberDeleted;
            } else {
                let n = 0;

                const messages = await channel.messages.fetch({ limit: 100 });
                const filteredMessages = messages.filter((message) => {
                    if (message.author.id == user.id && n < amount - i) {
                        n++;
                        return true;
                    }

                    return false;
                });

                if (filteredMessages.size == 0) {
                    amount = i;
                    break;
                }

                i += (await channel.bulkDelete(filteredMessages)).size;
            }
        }

        return sendSuccess(
            `Successfully deleted ${amount} message${amount == 1 ? '' : 's'}${user ? ` by ${user.username}` : ''}`
        );
    } catch (error) {
        console.error(error);
        return sendError('An error occurred while deleting messages');
    }
};

module.exports = {
    data: data,
    execute: execute,
};
