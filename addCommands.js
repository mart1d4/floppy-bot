require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commandsToDelete = ['1049457331299172422'];

const commands = [];
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// // Delete Guild Commands
// commandsToDelete.forEach((command) => {
//     rest.delete(
//         Routes.applicationGuildCommand(
//             process.env.CLIENT_ID,
//             process.env.GUILD_ID,
//             command
//         )
//     )
//         .then(() => console.log('Successfully deleted guild command'))
//         .catch(console.error);
// });

// // Delete Global Commands
// commandsToDelete.forEach((command) => {
//     rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command))
//         .then(() => console.log('Successfully deleted application command'))
//         .catch(console.error);
// });

// Deploy Commands Globally
(async () => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
