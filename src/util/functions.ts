import {Queue} from "@vortekore/lib";
import {Playlist, Video} from "better-youtube-api";
import {GuildMember} from "discord.js";
import {api} from "..";
import {TrackInfo} from "@lavalink/encoding";

export async function search(
	input: string,
	maxResults: number = 10
): Promise<(Video | Playlist)[]> {
	const {results} = await api.search([Video, Playlist], input, maxResults);
	return <(Video | Playlist)[]>results;
}

export function formatString(message: string, member: GuildMember) {
	const obj: Record<string, string> = {
		"{{mention}}": member.toString(),
		"{{member}}": member.user.tag,
		"{{server}}": member.guild.name,
		"{{memberCount}}": member.guild.memberCount.toLocaleString()
	};
	return message.replace(
		new RegExp(Object.keys(obj).join("|")),
		m => obj[m]
	);
}

export function formatNumber(n: number) {
	if (n < 1e3) return n;
	if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
}

export function isPromise(value: any): boolean {
	return (
		value &&
		typeof value.then === "function" &&
		typeof value.catch === "function"
	);
}

// export function getVolumeIcon(volume: number) {
// 	if (volume == 0) return "\uD83D\uDD07";
// 	else if (volume < 33) return "\uD83D\uDD08";
// 	else if (volume < 67) return "\uD83D\uDD09";
// 	else return "\uD83D\uDD0A";
// }

export function formatTime(duration: number) {
	const minutes = Math.floor(duration / 60000);
	const seconds = ((duration % 60000) / 1000).toFixed(0);
	// @ts-ignore
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function playerEmbed(
	queue: Queue,
	{np, position}: { np: TrackInfo, position: number }
) {
	return `${queue.player.paused ? "\u23F8" : "\u25B6"} ${progressBar(
		position / Number(np.length)
	)} \`[${formatTime(position)}/${formatTime(Number(np.length))}]\``;
}

export function progressBar(percent: number, length = 10) {
	let str = "";
	for (let i = 0; i < length; i++) {
		if (i == Math.round(percent * length)) str += "\uD83D\uDD18";
		else str += "▬";
	}
	return str;
}

export function In(member: GuildMember): boolean {
	if (!member.voice.channel) return false;
	return member.voice.channel.members.has(member.guild.me.id);

}
