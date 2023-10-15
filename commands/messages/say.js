import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Replies with your input")
    .addStringOption((option) =>
        option
            .setName("input")
            .setDescription("The input to print back.")
            .setMinLength(1)
            .setMaxLength(6000)
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName("number")
            .setDescription("The number of time to print back.")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("title")
            .setDescription("The title of the message.")
            .setMinLength(1)
            .setMaxLength(256)
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("color")
            .setDescription("The color of the embed (in hex). Defaults to #5865F2.")
            .setMinLength(3)
            .setMaxLength(7)
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName("sender")
            .setDescription("Whether or not to sign the message. Defaults to false.")
            .setRequired(false)
    )
    .addChannelOption((option) =>
        option
            .setName("channel")
            .setDescription("The channel to send the message in. Defaults to the current channel.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

export const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const options = interaction.options;
    const input = options.getString("input");
    const number = options.getInteger("number") ?? 1;
    const title = options.getString("title") ?? null;
    const color = getColor(options.getString("color")) ?? 0x5865f2;
    const sender = options.getBoolean("sender") ?? false;
    const channel = options.getChannel("channel") ?? interaction.channel;

    const getColor = (color) => {
        if (!color.startsWith("#")) {
            color = "#" + color;
        }

        if (color.length === 4) {
            color += color[1] + color[2] + color[3];
        }

        if (color.length !== 7) {
            return null;
        }

        return color;
    };

    const embed = new EmbedBuilder().setDescription(input).setColor(color);

    if (title) {
        embed.setTitle(title);
    }

    if (sender) {
        embed.setFooter({
            text: `Sent by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
        });
    }

    try {
        for (let i = 0; i < number; i++) {
            await channel.send({ embeds: [embed] });
        }

        const successEmbed = new EmbedBuilder()
            .setAuthor({
                name: `|  Successfully sent ${number} message${number > 1 ? "s" : ""} to #${channel.name}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0x57f287);

        await interaction.deleteReply();
        return interaction.channel.send({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
        console.error(error);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  An error occurred while sending the message`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor(0xed4245);

        await interaction.deleteReply();
        return interaction.channel.send({ embeds: [embed], ephemeral: true });
    }
};
