const { EmbedBuilder } = require('discord.js');

const listener = (player) => {
    player.events.on('playerStart', (queue, track) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: queue.guild.name,
                iconURL: queue.guild.iconURL()
            })
            .setThumbnail(track.thumbnail)
            .setTitle('Now Playing')
            .setDescription(`[${track.title}](${track.url})`)
            .addFields(
                { name: 'Duration', value: `\`${track.duration}\``, inline: true },
                { name: 'Queue', value: `\`${queue.size}\``, inline: true },
                { name: 'Volume', value: `\`${queue.node.volume}%\``, inline: true },
                { name: 'Requester', value: `<@${queue.metadata.member.id}>`, inline: false },
            )
            .setColor(0x5865F2);

        queue.metadata.channel.send({ embeds: [embed] });
    });

    player.events.on('audioTrackAdd', (queue, track) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `|  Track added - ${track.title}`,
                iconURL: queue.guild.iconURL()
            })
            .setColor(0x57F287);

        queue.metadata.channel.send({ embeds: [embed] });
    });

    player.events.on('audioTracksAdd', (queue, track) => {
        const fullDuration = track.reduce((acc, cur) => acc + cur.duration, 0);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: queue.guild.name,
                iconURL: queue.guild.iconURL()
            })
            .setTitle('Tracks Added')
            .setDescription(`Added \`${track.length}\` tracks to the queue\nUse \`/queue\` to see the full queue.`)
            .addFields(
                { name: 'Duration', value: `\`${fullDuration}\``, inline: true },
                { name: 'Queue', value: `\`${queue.size}\``, inline: true },
                { name: 'Requester', value: `<@${queue.metadata.member.id}>`, inline: false },
            )
            .setColor(0x57F287);

        queue.metadata.channel.send({ embeds: [embed] });
    });

    player.events.on('playerSkip', (queue, track) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: queue.guild.name,
                iconURL: queue.guild.iconURL()
            })
            .setThumbnail(track.thumbnail)
            .setTitle('Track Skipped')
            .setDescription(`Skipped [${track.title}](${track.url}) due to an issue.`)
            .setColor(0x5865F2);

        queue.metadata.channel.send({ embeds: [embed] });
    });

    player.events.on('disconnect', (queue) => {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: '|  Disconnected from voice channel',
                iconURL: queue.guild.iconURL()
            })
            .setColor(0xFEE75C);

        queue.metadata.channel.send({ embeds: [embed] });
    });
}

module.exports = listener;
