export const ROOM_TYPES = {
	checkers: "checkers",
	chat: "chat",
} as const;
export const CHECKERS_ROOM_STYLES = {
	PVP: "pvp",
	BOT: "computer",
	LOCAL: "local",
} as const;
export const ALL_ROOM_STYLES = {
	...CHECKERS_ROOM_STYLES,
} as const;
