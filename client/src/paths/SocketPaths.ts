export const Paths = {
	Base: "/",
	App: "/App",
	Auth: {
		Base: "/Auth",
		Login: "/Auth/Login",
	},
	Games: {
		Base: "/Games",
		Checkers: "/Games/Checkers",
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
