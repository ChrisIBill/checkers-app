export const Paths = {
	Base: "/",
	App: {
		Base: "/App",
	},
	Auth: {
		Base: "/Auth",
		Login: "/Auth/Login",
	},
	Games: {
		Base: "/Games",
		Checkers: "/Games/Checkers",
	},
	Admin: {
		Base: "/Admin",
	},
} as const;

export const PathsSet = [
	"/",
	"/App",
	"/Auth",
	"/Auth/Login",
	"/Games",
	"/Games/Checkers",
] as const;

export const SERVER_PATHS = [
	"/",
	"/Auth",
	"/Guest",
	"/User",
	"/Admin",
] as const;
