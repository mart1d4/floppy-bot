const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');
require('dotenv').config();

const data = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Replies to your quesiton')
    .addStringOption((option) =>
        option
            .setName('question')
            .setDescription('The question you want to ask')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(true)
    );

const execute = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const messages = [{
        "role": "user",
        "content": interaction.options.getString('question'),
        "name": interaction.user.username
    }];

    await interaction.channel.send({ content: `${interaction.user.username} asked: ${interaction.options.getString('question')}` });

    const getAnswer = async () => {
        const answer = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "max_tokens": 150,
                "temperature": 0.2,
            })
        }).then(res => res.json()).catch(err => console.log(err));

        if (answer.error) {
            return answer.error.message;
        } else {
            return answer?.choices[0]?.message?.content;
        }
    };

    const answer = await getAnswer();

    messages.push({
        "role": "assistant",
        "content": answer,
        "name": "Floppy"
    });

    await interaction.channel.send({ content: answer });
    await interaction.deleteReply();

    const filter = m => m.content !== answer && !m.author.bot;
    const collector = interaction.channel.createMessageCollector({ time: 1000 * 60 * 5, filter: filter });

    collector.on('collect', async (m) => {
        messages.push({
            "role": m.author.bot ? "assistant" : "user",
            "content": m.content,
            "name": m.author.bot ? "Floppy" : m.author.username
        });

        const newAnswer = await getAnswer();
        messages.push({
            "role": "assistant",
            "content": newAnswer,
            "name": "Floppy"
        });

        if (!newAnswer || newAnswer === answer) {
            return;
        }

        await interaction.channel.send({ content: newAnswer });
    });

    collector.on('end', async (collected) => {
        console.log(`Collected ${collected.size} items`);

        const embed = new EmbedBuilder()
            .setTitle('Conversation ended')
            .setDescription(`
                I ended the conversation because it lasted 5 minutes.
                If you want to talk again, just ask me a question.
                I have answered ${collected.size} questions.
            `)
            .setColor('#0099ff')
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
    });

    return;
};

module.exports = {
    data,
    execute,
};
