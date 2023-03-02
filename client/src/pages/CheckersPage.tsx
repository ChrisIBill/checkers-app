import "./CheckersPage.scss";

const CheckersSquare = ({ elem, index }: { elem: string; index: number }) => {
    console.log("Rendering individual square: " + elem);
    switch (elem) {
        case "E":
            return (
                <div className="EmptySquare">
                    <p>{index}</p>
                </div>
            );
        case "p":
            return (
                <div className="FullSquare">
                    <div className="CheckersPiece">
                        <p>{index}</p>
                    </div>
                </div>
            );
        case "P":
            return (
                <div className="FullSquare">
                    <div className="CheckersPiece">
                        <div className="CheckersPiece">
                            <p>{index}</p>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="EmptySquare">Error</div>;
    }
};
const CheckersBoard = ({ board }: { board: string[] }) => {
    let isFlippedRow = true;
    let rowNum = 0;
    const GameBoard = board.map((elem, index) => {
        if (index % 4 == 0) {
            isFlippedRow = !isFlippedRow;
        }
        console.log(
            "Rendering checkers square, elem: " +
                elem +
                " index: " +
                index +
                " flip: " +
                isFlippedRow
        );
        if (isFlippedRow) {
            return (
                <div className="CheckersSquares" key={index}>
                    <CheckersSquare elem={elem} index={index} />
                    <div className="DeadSquare"></div>
                </div>
            );
        }
        return (
            <div className="CheckersSquares" key={index}>
                <div className="DeadSquare"></div>
                <CheckersSquare elem={elem} index={index} />
            </div>
        );
    });
    console.log(GameBoard);
    return <ul id="CheckersBoardWrapper">{GameBoard}</ul>;
};
const MoveList = () => {
    return <div id="MoveListWrapper"></div>;
};
const CheckersPage = ({ board }: { board: string[] }) => {
    return (
        <div id="CheckersPageWrapper">
            <CheckersBoard board={board} />
        </div>
    );
};

export { CheckersPage };
