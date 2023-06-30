import { SpotifyExtractor } from '@discord-player/extractor';
import { useMasterPlayer } from "discord-player";
import { Events } from "discord.js";

export const execute = async (client) => {
    const player = useMasterPlayer();

    await player.extractors.register(SpotifyExtractor, {});
    console.log(`Logged in as ${client.user.tag}!`);
};

export const name = Events.ClientReady;
export const once = true;
