import {Button} from "@mui/material";
import {NavigateFunction} from "react-router-dom";
import {Paths} from "../paths/SocketPaths";

export const PlayGamesButton = ({
	onClick,
	text,
	isDisabled = false,
}: {
	onClick: () => void;
	text?: string;
	isDisabled?: boolean;
}) => {
	return (
		<Button disabled={isDisabled} onClick={onClick}>
			{text ? text : "Play Checkers"}
		</Button>
	);
};

export const selectGameModePanel = ({onClick}: {onClick: () => void}) => {
	return;
};
