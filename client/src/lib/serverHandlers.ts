export function serverGameStateParse(str: string): string[] {
    const board: string[] = [];
    const tokens: string[] = str.split("/");
    console.log("Parsing Game State: " + str);
    for (const t of tokens) {
        if (t == "") {
            //Should fix this
            break;
        }
        let c: string = t.at(0)!;
        let num = "";
        let j = t.length;
        if (j != 1) {
            num = t.slice(1, j + 1);
        } else num = "1";
        for (let k = 0; k < Number(num); k++) {
            board.push(c);
        }
    }
    console.log("Parsed Board:");
    console.log(board);
    return board;
}
export async function request<TResponse>(
    url: string,
    config: RequestInit = {}
): Promise<TResponse> {
    return fetch(url, config)
        .then((res) => res.json())
        .then((data) => data as TResponse)
        .catch((error) => {
            console.log("Error");
            return error as TResponse;
        });
}
