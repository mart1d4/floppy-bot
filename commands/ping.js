const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Displays the bot's latency");

const execute = async (interaction) => {
    const sent = await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Pinging...')
                .setTimestamp()
                .setColor('0x5E81AC'),
        ],
    });

    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Pong!')
                .setDescription(
                    `Latency is ${
                        sent.createdTimestamp - interaction.createdTimestamp
                    }ms. API Latency is ${'hee'}ms`
                )
                .setTimestamp()
                .setColor('0x5E81AC'),
        ],
    });

    setTimeout(async () => {
        await interaction.deleteReply();
    }, 600000);
};

module.exports = {
    data,
    execute,
};
