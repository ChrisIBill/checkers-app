import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";
import { CheckersPage } from "./pages/CheckersPage";

const socket = io("localhost:3001");

function App() {
    socket.on("connect", () => {
        console.log(socket.id);
    });
    socket.on("error", () => {
        console.log("Error");
    });
    return (
        <div className="App">
            <CheckersPage />
        </div>
    );
}

export default App;
