const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');
const {
    userHasPermission,
    userHasChannelPermission,
} = require('../utils/permissions.js');

const data = new SlashCommandBuilder()
    .setName('answer')
    .setDescription('Provide an answer to a question');

const execute = async (interaction) => {
    // const select = new StringSelectMenuBuilder()
    //     .setCustomId('starter')
    //     .setPlaceholder('Make a selection!')
    //     .addOptions(
    //         new StringSelectMenuOptionBuilder()
    //             .setLabel('Bulbasaur')
    //             .setDescription('The dual-type Grass/Poison Seed Pokémon.')
    //             .setValue('bulbasaur')
    //             .setDefault(true),
    //         new StringSelectMenuOptionBuilder()
    //             .setLabel('Charmander')
    //             .setDescription('The Fire-type Lizard Pokémon.')
    //             .setValue('charmander'),
    //         new StringSelectMenuOptionBuilder()
    //             .setLabel('Squirtle')
    //             .setDescription('The Water-type Tiny Turtle Pokémon.')
    //             .setValue('squirtle'),
    //     );

    // const row = new ActionRowBuilder()
    //     .addComponents(select);


    // const response = await interaction.reply({
    //     content: 'Choose your starter!',
    //     components: [row],
    // });

    // const collectorFilter = i => i.user.id === interaction.user.id;

    // try {
    //     const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

    //     if (confirmation.customId === 'starter') {
    //         await confirmation.update({ content: `You chose ${confirmation.values[0]}`, components: [] });
    //     } else if (confirmation.customId === 'cancel') {
    //         await confirmation.update({ content: 'Action cancelled', components: [] });
    //     }
    // } catch (e) {
    //     await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    // }

    const modal = new ModalBuilder()
        .setCustomId('myModal')
        .setTitle('My Modal');

    // Add components to modal

    // Create the text input components
    const favoriteColorInput = new TextInputBuilder()
        .setCustomId('favoriteColorInput')
        // The label is the prompt the user sees for this input
        .setLabel("What's your favorite color?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
        .setCustomId('hobbiesInput')
        .setLabel("What's some of your favorite hobbies?")
        // Paragraph means multiple lines of text.
        .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
};

module.exports = {
    data,
    execute,
};
