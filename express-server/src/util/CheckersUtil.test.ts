import { compareCheckersTokens } from "./CheckersUtil";
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
