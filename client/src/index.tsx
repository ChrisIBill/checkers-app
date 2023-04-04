import React from "react";
import ReactDOM from "react-dom/client";

import {io, Socket} from "socket.io-client";
import "./index.css";
import {MainPage} from "./pages/MainPage";
import reportWebVitals from "./reportWebVitals";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import {Paths} from "./paths/SocketPaths";
import {RootPage} from "./pages/RootPage";
import {LoginPage} from "./pages/LoginPage";
import {ErrorPage} from "./pages/ErrorPage";
import {CheckersPage} from "./pages/CheckersPage";
import {GamesPage} from "./pages/GamesPage";
import {TEMPINTERNALDEFAULTCHECKERSSTATE} from "./constants/checkersData";
import {AppHeader} from "./components/main-components/header";
import {AdminPage} from "./pages/AdminPage";
const routes = [
	{
		path: Paths.Base,
		element: <RootPage />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: Paths.App.Base,
				indexElement: <MainPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: Paths.Auth.Login,
				element: <LoginPage />,
			},
			{
				path: Paths.Games.Base,
				element: <GamesPage />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: Paths.Games.Checkers /*  + "/:id" */,
						element: <CheckersPage />,
						errorElement: <ErrorPage />,
					},
				],
			},
		],
	},
];

const elemRoutes = createRoutesFromElements(
	<Route path={Paths.Base} element={<RootPage />} errorElement={<ErrorPage />}>
		<Route
			path={Paths.Admin.Base}
			element={<AdminPage />}
			errorElement={<ErrorPage />}
		/>
		<Route
			path={Paths.Games.Base}
			element={<GamesPage />}
			errorElement={<ErrorPage />}
		>
			<Route
				path={Paths.Games.Checkers}
				element={<CheckersPage />}
				errorElement={<ErrorPage />}
			/>
		</Route>
		<Route index element={<MainPage />} errorElement={<ErrorPage />} />
	</Route>
);
/* const eRoutes = createRoutesFromElements(
	<Route path={Paths.Base} element={<RootPage />} />
	<Route path={Paths.Auth.Base} element={<RootPage />} />
); */
const router = createBrowserRouter(elemRoutes);
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
