import "./CheckersPage.scss";

const CheckersSquare = () => {};
const CheckersBoard = () => {
    const board = Array(64);
    const GameBoard = board.map((elem, index) => (
        <li key={index}>
            <div className="CheckersSquare">{elem}</div>
        </li>
    ));
    console.log(GameBoard);
    return <ul id="CheckersBoardWrapper">{GameBoard}</ul>;
};
const MoveList = () => {
    return <div id="MoveListWrapper"></div>;
};
const CheckersPage = () => {
    return (
        <div id="CheckersPageWrapper">
            <MoveList />
            <CheckersBoard />
        </div>
    );
};

export { CheckersPage };
