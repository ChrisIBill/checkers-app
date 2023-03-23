import { Button } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { Paths } from "../paths/SocketPaths";

const PlayCheckersButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Button onClick={onClick}>Play Checkers</Button>
    )
}

export const selectGameModePanel = ({onClick}: {onClick: () => void}) => {
    return 
}