import { Collection } from 'discord.js';

export const execute = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        return console.error(`No command matching ${interaction.commandName} was found.`);
    }

    const cooldowns = interaction.client.cooldowns;

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 5;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);

            return interaction.reply({
                content: `
                    Please wait, you are on a cooldown for \`${command.data.name}\`.
                    You can use it again <t:${expiredTimestamp}:R>.
                `,
                ephemeral: true
            });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}. \n${error}`);
    }
};

export const name = 'interactionCreate';
export const once = false;
