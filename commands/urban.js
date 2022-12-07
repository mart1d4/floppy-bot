const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Searches Urban Dictionary for a term')
    .addStringOption((option) =>
        option
            .setName('term')
            .setDescription('The term to search for')
            .setRequired(true)
    );

const execute = async (interaction) => {
    await interaction.deferReply();

    const term = interaction.options.getString('term');

    const { list } = await fetch(
        `https://api.urbandictionary.com/v0/define?term=${term}`
    ).then((response) => response.json());

    if (!list.length) {
        const embed = new EmbedBuilder()
            .setTitle('No Results')
            .setDescription(
                `No results found for **${term}**. Try searching for something else.`
            )
            .setColor('0x5E81AC');

        return await interaction.editReply({ embeds: [embed] });
    }

    const [answer] = list;

    const embed = new EmbedBuilder()
        .setTitle(`Definition of ${term}`)
        .setURL(answer.permalink)
        .setThumbnail(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Urban_Dictionary_logo.svg/1200px-Urban_Dictionary_logo.svg.png'
        )
        .setDescription(
            `${
                answer.definition.length > 1024
                    ? `${answer.definition.substring(0, 1021)}...`
                    : answer.definition
            }`
        )
        .addFields(
            {
                name: 'Example',
                value: `${
                    answer.example.length > 1024
                        ? `${answer.example.substring(0, 1021)}...`
                        : answer.example
                }`,
                inline: false,
            },
            {
                name: '👍',
                value: answer.thumbs_up.toString(),
                inline: true,
            },
            {
                name: '👎',
                value: answer.thumbs_down.toString(),
                inline: true,
            }
        )
        .setFooter({
            text: `Written by ${answer.author}`,
        })
        .setTimestamp(new Date(answer.written_on))
        .setColor('0x5E81AC');

    await interaction.editReply({ embeds: [embed] });
};

module.exports = {
    data,
    execute,
};
