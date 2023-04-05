export function validateMoves(
    boardState: ValidTokens[],
    newBoardState: ValidTokens[]
): ValidTokens[] {
    if (newBoardState.length !== 32) {
        throw new Error(
            "Invalid Board State Length of " + newBoardState.length
        );
    }
    for (let i = 0; i < oldBoardState.length; i++) {
        if (oldBoardState[i] !== newBoardState[i]) {
            if (
                oldBoardState[i] === ValidTokens.EMPTY &&
                newBoardState[i] !== ValidTokens.EMPTY
            ) {
                continue;
            }
            throw new Error("Board state is not valid");
        }
    }
    return newBoardState;
}
