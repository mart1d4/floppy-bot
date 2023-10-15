import { Client, Collection, GatewayIntentBits, Partials, ActivityType } from "discord.js";
import { listener } from "./events/musicPlayer.js";
import { Player } from "discord-player";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import "dotenv/config";

const clientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ],
    presence: {
        status: "online",
        activities: [
            {
                name: "Taking care of you",
                type: ActivityType.Playing,
            },
        ],
    },
    partials: [Partials.Channel],
};

const client = new Client(clientOptions);

// Music player
const player = Player.singleton(client);
listener(player);

// Events
const eventsPath = join(process.cwd(), "events");
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of eventFiles) {
    const url = `file:///${join(eventsPath, file)}`;
    const eventFile = await import(url);

    if (eventFile.once) {
        client.once(eventFile.name, (...args) => eventFile.execute(...args));
    } else if (eventFile.once === false) {
        client.on(eventFile.name, (...args) => eventFile.execute(...args));
    }
}

// Commands
client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = join(process.cwd(), "commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
        const url = `file:///${join(commandsPath, file)}`;
        const commandFile = await import(url);

        if (commandFile.data && commandFile.execute) {
            client.commands.set(commandFile.data.name, commandFile);
        } else {
            console.log(`[WARNING] The command at ${url} is missing a required "data" or "execute" property.`);
        }
    }
}

client.login(process.env.CLIENT_TOKEN);
export default client;
