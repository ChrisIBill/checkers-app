import React from "react";
import ReactDOM from "react-dom/client";

import {io, Socket} from "socket.io-client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import {Paths} from "./paths/SocketPaths";
import {Root} from "./pages/RootPage";
import {AuthPage, LoginPage} from "./pages/LoginPage";
import {ErrorPage} from "./pages/ErrorPage";
const routes = [
	{
		path: Paths.Base,
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: Paths.Auth.Base,
				element: <AuthPage />,
			},
			{
				path: Paths.Auth.Login,
				element: <LoginPage />,
			},
			{
				path: Paths.App,
				element: <App />,
			},
		],
	},
];
const router = createBrowserRouter(routes);
console.log(router);
console.log("Routes: ", routes);
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
