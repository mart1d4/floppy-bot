import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMasterPlayer } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music for you')
    .addStringOption((option) =>
        option
            .setName('song')
            .setDescription('The song you want to play')
            .setMinLength(1)
            .setMaxLength(500)
            .setRequired(true)
    )
    .setDMPermission(false);

export const execute = async (interaction) => {
    if (!interaction.member?.voice?.channel) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  You must be in a voice channel to use this command',
                iconURL: interaction.guild.iconURL()
            })
            .setColor(0xFEE75C);

        return interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply({ ephemeral: true });

    const query = interaction.options.getString('song', true);
    const player = useMasterPlayer();

    try {
        await player.play(interaction.member.voice.channel, query, {
            nodeOptions: {
                metadata: interaction
            }
        });

        return interaction.deleteReply();
    } catch (e) {
        console.error(e);

        if (e.contains('No results found')) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: '|  No results found',
                    iconURL: interaction.client.user.avatarURL()
                })
                .setColor(0xED4245);

            return interaction.followUp({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  Something went wrong',
                iconURL: interaction.client.user.avatarURL()
            })
            .setColor(0xED4245);

        return interaction.followUp({ embeds: [embed] });
    }
};
