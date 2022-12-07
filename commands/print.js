const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('print')
    .setDescription('Replies with your input')
    .addStringOption((option) =>
        option
            .setName('input')
            .setDescription('The input to print back')
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(2000)
    )
    .addIntegerOption((option) =>
        option
            .setName('number')
            .setDescription('The number of time to print back')
    )
    .addChannelOption((option) =>
        option.setName('channel').setDescription('The channel to print back')
    )
    .addBooleanOption((option) =>
        option
            .setName('embed')
            .setDescription('Whether or not the print should be embedded')
    );

const execute = async (interaction) => {
    await interaction.deferReply();

    const title = interaction.options.getString('title');
    const input = interaction.options.getString('input');
    const number = interaction.options.getInteger('number') ?? 1;
    const channel =
        interaction.options.getChannel('channel') ?? interaction.channel;
    const embed = interaction.options.getBoolean('embed') ?? true;

    if (number <= 0) {
        await interaction.reply({
            content: 'The number must be greater than 0',
            ephemeral: true,
        });
        return;
    }

    if (embed) {
        for (let i = 0; i < number; i++) {
            await channel.send({
                embeds: [
                    {
                        title: 'Print',
                        description: input,
                    },
                ],
            });
        }
    } else {
        for (let i = 0; i < number; i++) {
            await channel.send(input);
        }
    }

    await interaction.editReply(
        `Printed \`${input}\` ${number} time(s) to ${channel}`
    );

    return;
};

module.exports = {
    data,
    execute,
};
