const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType,
} = require('discord.js');
const {
    userHasPermission,
    userHasChannelPermission,
} = require('../utils/permissions.js');

const timout = process.env.TIMEOUT;

const data = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Replies with your input')
    .addStringOption((option) =>
        option
            .setName('input')
            .setDescription('The input to print back.')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('The number of time to print back.')
            .setMinValue(1)
            .setMaxValue(500)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('title')
            .setDescription('The title of the message.')
            .setMinLength(1)
            .setMaxLength(256)
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName('color')
            .setDescription(
                'The color of the embed (in hex). Defaults to #202225.'
            )
            .setMinLength(3)
            .setMaxLength(7)
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName('sender')
            .setDescription(
                "Whether or not to print the sender's name. Defaults to false."
            )
            .setRequired(false)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription(
                'The channel to print back. Defaults to the current channel.'
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
    );

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const options = interaction.options;
    const input = options.getString('input');
    const number = options.getInteger('amount');
    const title = options.getString('title') ?? null;
    let color = options.getString('color') ?? '#202225';
    const sender = options.getBoolean('sender') ?? false;
    const channel = options.getChannel('channel') ?? interaction.channel;

    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    if (color.length === 4) {
        color =
            '#' +
            color[1] +
            color[1] +
            color[2] +
            color[2] +
            color[3] +
            color[3];
    }
    if (color.length !== 7) {
        color = false;
    }

    if (
        !userHasChannelPermission(
            interaction.member,
            channel,
            'SEND_MESSAGES'
        ) ||
        !userHasPermission(interaction.member, 'SEND_MESSAGES')
    ) {
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(
                'You do not have permission to send messages in this channel.'
            )
            .setTimestamp()
            .setColor(0xed4245);
        await interaction.editReply({ embeds: [embed] }).then(
            setTimeout(() => {
                interaction.deleteReply();
            }, timout)
        );
    } else {
        const embed = new EmbedBuilder()
            .setDescription(input)
            .setColor(color == false ? 0x202225 : color);
        title && embed.setTitle(title);
        sender &&
            embed.setFooter({
                text: `Sent by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
            });
        for (let i = 0; i < number; i++) {
            await channel.send({ embeds: [embed] });
        }
        await interaction.channel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Success')
                        .setDescription(
                            `Successfully sent ${number} message${number > 1 ? 's' : ''
                            } to ${channel}${!color
                                ? '\n\n You entered an invalid color\n Messages were sent with default color `#202225`'
                                : ''
                            }`
                        )
                        .setTimestamp()
                        .setColor(0x57f287),
                ],
                ephemeral: true,
            })
            .then((message) =>
                setTimeout(() => {
                    message.delete();
                }, timout)
            );
    }

    await interaction.deleteReply();
};

module.exports = {
    data,
    execute,
};
