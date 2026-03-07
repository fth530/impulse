import {
    isEven,
    isOdd,
    isPrime,
    isGreaterThan,
    isLessThan,
    checkRule,
    generateDynamicRule,
    generateEquation
} from "./useMathGame";

describe("Dynamic Difficulty Math Engine", () => {
    describe("Rule Checkers", () => {
        it("should handle basic even/odd primes", () => {
            expect(isEven(4)).toBe(true);
            expect(isOdd(3)).toBe(true);
            expect(isPrime(7)).toBe(true);
        });

        it("should perform generic comparisons", () => {
            expect(isGreaterThan(12, 10)).toBe(true);
            expect(isGreaterThan(9, 10)).toBe(false);
            expect(isLessThan(8, 10)).toBe(true);
            expect(isLessThan(15, 10)).toBe(false);
        });
    });

    describe("checkRule execution", () => {
        it("decodes string parameters", () => {
            expect(checkRule(25, { id: "gt_20", label: "" })).toBe(true);
            expect(checkRule(15, { id: "lt_20", label: "" })).toBe(true);
            expect(checkRule(15, { id: "ends_5", label: "" })).toBe(true);
            expect(checkRule(30, { id: "ends_0", label: "" })).toBe(true);
            expect(checkRule(9, { id: "mod_3", label: "" })).toBe(true);
        });

        it("rejects false conditions", () => {
            expect(checkRule(31, { id: "ends_0", label: "" })).toBe(false);
            expect(checkRule(8, { id: "mod_3", label: "" })).toBe(false);
        });
    });

    describe("generateEquation Scaling", () => {
        it("never returns negative results in low levels", () => {
            for (let i = 0; i < 50; i++) {
                const eq = generateEquation(10); // score 10
                expect(eq.result).toBeGreaterThan(0);
            }
        });

        it("evaluates correctly for higher levels logic", () => {
            for (let i = 0; i < 50; i++) {
                const eq = generateEquation(65); // high score, has div and parens
                expect(eq.result).toBeGreaterThan(0);
                expect(Number.isInteger(eq.result)).toBe(true); // especially for divisions
            }
        });
    });
});
