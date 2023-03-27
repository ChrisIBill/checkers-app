import { VALID_TOKENS_STRING } from "@src/constants/checkersData";
import { ValidTokens } from "@src/interfaces/checkersInterfaces";

export function unzipGameState(str: string): ValidTokens[] {
    const board: ValidTokens[] = [];
    const tokens: string[] = str.split("/");
    console.log("Parsing Game State: " + str);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.length == 0) {
            //Should fix this
            console.log("ERROR: Invalid Token Length");
            break;
        }
        let token: ValidTokens;
        if (!VALID_TOKENS_STRING.includes(t.at(0)!)) {
            console.log("ERROR: Invalid Token Start, Token: ", t);
            break;
        } else {
            token = t.charAt(0)! as ValidTokens;
        }
        let num = parseInt(t.slice(1));
        if (isNaN(num)) {
            num = 1;
        }
        for (let k = 0; k < Number(num); k++) {
            board.push(token);
        }
    }

    console.log("Parsed Board:");
    console.log(board);
    return board;
}

export function zipGameState(gameState: ValidTokens[]): string {
    //[p,p,p,p,p,p,p,p,p,p,p,p,E,E,E,E...] -> p12/E8/P12/
    console.log("zipGameState: ", gameState);
    let i = 0;
    let num = 1;
    let prevChar: any = undefined;
    const ret = gameState.reduce((acc, curVal, index) => {
        if (curVal == prevChar) {
            num++;
            return acc;
        } else if (curVal != prevChar) {
            let ret = num > 1 ? num + "/" + curVal : "/" + curVal;
            prevChar = curVal;
            num = 1;
            return acc + ret;
        } else {
            return acc;
        }
    }, "" as string);
    console.log("Comp gameState: ", ret);
    return ret;
}
