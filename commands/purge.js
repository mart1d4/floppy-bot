const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes the specified number of messages')
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('The number of messages to delete')
            .setMaxValue(500)
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to delete messages from')
            .setRequired(false)
    )
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription('The user to delete messages from')
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName('all')
            .setDescription('Whether or not to delete all messages')
            .setRequired(false)
    );

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger('amount');
    const channel =
        interaction.options.getChannel('channel') ?? interaction.channel;
    const user = interaction.options.getUser('user') ?? null;

    if (
        (!interaction.member.permissions.has(
            PermissionsBitField.Flags.ManageMessages
        ) &&
            !user == null) ||
        !channel
            .permissionsFor(interaction.member)
            .has(PermissionsBitField.Flags.ViewChannel)
    ) {
        await interaction.reply({
            content: 'You do not have permission to use this command',
            ephemeral: true,
        });
        return;
    }

    const messages =
        user == null
            ? await channel.messages.fetch({ limit: amount })
            : await channel.messages.fetch({ limit: amount, user: user });

    const embed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription(
            `Deleted ${amount} message${amount > 1 ? 's' : ''} by ${
                user ? user.tag : ''
            } in ${channel}`
        )
        .setTimestamp()
        .setColor('0x5E81AC');

    await interaction.editReply({ embeds: [embed] });

    setTimeout(async () => {
        await interaction.deleteReply();
    }, 5000);
};

module.exports = {
    data,
    execute,
};
