import { describe, expect, test } from "@jest/globals";
import {
    compareCheckersTokens,
    unzipGameState,
    zipGameState,
} from "./CheckersUtil";
import {
    BOARD_EDGES,
    BOARD_ROW_LENGTH,
    BOARD_COLUMN_LENGTH,
} from "@src/constants/checkersData";
import { ValidTokens } from "@src/interfaces/checkersInterfaces";

/* test("compareCheckersTokens", () => {
    expect(compareCheckersTokens("p", "p")).toBe(-1);
    expect(compareCheckersTokens("p", "k")).toBe(-1);
    expect(compareCheckersTokens("p", "P")).toBe(1);
    expect(compareCheckersTokens("p", "K")).toBe(1);
    expect(compareCheckersTokens("p", "E")).toBe(0);
    expect(compareCheckersTokens("k", "p")).toBe(-1);
    expect(compareCheckersTokens("k", "k")).toBe(-1);
    expect(compareCheckersTokens("k", "P")).toBe(1);
    expect(compareCheckersTokens("k", "K")).toBe(1);
    expect(compareCheckersTokens("k", "E")).toBe(0);
    expect(compareCheckersTokens("P", "p")).toBe(1);
    expect(compareCheckersTokens("P", "k")).toBe(1);
    expect(compareCheckersTokens("P", "P")).toBe(-1);
    expect(compareCheckersTokens("P", "K")).toBe(-1);
    expect(compareCheckersTokens("P", "E")).toBe(0);
}); */

describe("CheckersUtil", () => {
    test("compareCheckersTokens", () => {
        expect(compareCheckersTokens("p", "p")).toBe(-1);
        expect(compareCheckersTokens("p", "k")).toBe(-1);
        expect(compareCheckersTokens("p", "P")).toBe(1);
        expect(compareCheckersTokens("p", "K")).toBe(1);
        expect(compareCheckersTokens("p", "E")).toBe(0);
        expect(compareCheckersTokens("k", "p")).toBe(-1);
        expect(compareCheckersTokens("k", "k")).toBe(-1);
        expect(compareCheckersTokens("k", "P")).toBe(1);
        expect(compareCheckersTokens("k", "K")).toBe(1);
        expect(compareCheckersTokens("k", "E")).toBe(0);
        expect(compareCheckersTokens("P", "p")).toBe(1);
        expect(compareCheckersTokens("P", "k")).toBe(1);
        expect(compareCheckersTokens("P", "P")).toBe(-1);
        expect(compareCheckersTokens("P", "K")).toBe(-1);
        expect(compareCheckersTokens("P", "E")).toBe(0);
    });

    test("zipGameState", () => {
        const testBoardStrings = [
            "kEEKKpPppPEEEPKEPEEKEkKPpKkEpkPK",
            "kPpppEkppPEEpPkPEKPpPEkpPKKPKpEK",
            "kKkPPPEpEPpKkpKpEPEEEEPEKkEKkppk",
            "KPEKkKPKEpEKPkpkpEkEkPkpKkpEPkkk",
            "PPEPppkpkEEkkpEEEPKEEKpkpKkpPpKk",
            "KEEPkPpPKkkEEkPkkpEKKkEKEpPPKEKk",
            "PPEpKpKpkPPpPPkPEkkkpkKKEpkppPkK",
            "PEKPPPkEkPppKEPpPEPppkEKpEEkKkKp",
            "EKPEkpPkPkkEPKpEPKPEpKKpEPKPpkpp",
            "pEkkpKPKkkkEEEKpkppEppkkpPKKpPpE",
            "kKPkPKKEkPKKEEkKEEKpEKpKKKKEEKpp",
            "EPkKEkPKkpPEKEkEEEkKKppPKKEpKPPp",
            "PEPpEkEEPEPKKEKpkPPkpEEppEkKkKkE",
            "PkppkKKPPKKEpKkPEKKEppPkPkPpPEpp",
            "kEPpkpPKkPEKkEPEkEkpPPppkkpkKkKk",
            "PPKEEPKKkpPkEEpPkEPPPppPPEKkPKEE",
            "KEEEpKKpkKpEEpkEPKpPEpKEpEPEkpPP",
            "KPEkPkKpkkEPEkEpkkEkEEPkEppPKEkK",
            "KkPPPkpkkkPPpEKKkkkKkEpkpEPpKEPP",
            "KkkPKPPpEkpPEpEEEkKPPpPKkkkEPPEK",
        ];
        const testCases = testBoardStrings.map(
            (str) => str.split("") as ValidTokens[]
        );
        const test2 = [
            "E",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "E",
            "p",
            "p",
            "p",
            "E",
            "p",
            "E",
            "E",
            "E",
            "E",
            "E",
            "E",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
        ] as ValidTokens[];
        const test3 = [
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "p",
            "E",
            "p",
            "p",
            "E",
            "E",
            "p",
            "E",
            "E",
            "E",
            "E",
            "E",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "P",
            "K",
        ] as ValidTokens[];
        expect(zipGameState(testCases[0]));
        expect(zipGameState(testCases[1]));
        expect(zipGameState(testCases[2]));
        expect(zipGameState(testCases[3]));
        expect(zipGameState(testCases[4]));
        expect(zipGameState(testCases[5]));
        expect(zipGameState(test2));
        expect(zipGameState(test3));
    });
    test("unzipGameState", () => {
        expect(unzipGameState("9pE2p2Ep5E11PK"));
        expect(unzipGameState("E7pE3pEp6E11P"));
    });
});
[
    "E",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "E",
    "p",
    "p",
    "p",
    "E",
    "p",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
];
