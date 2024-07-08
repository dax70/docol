import { describe, expect, test } from "vitest";
import { lexSymbol, symbols } from "./lexer";

describe("lex operators", () => {
  // Setup expected output
  const expectedMatches = symbols.map((symbol) => ({
    symbol,
    expected: {
      index: 0,
      type: "symbol",
      lexeme: symbol,
    },
  }));

  // Run Test Each - https://vitest.dev/api/#test-each

  // Positive - should find matches
  test.each(expectedMatches)("Positive -> $symbol", ({ symbol, expected }) => {
    expect(lexSymbol(symbol, 0)).toStrictEqual(expected);
  });
  // });

  // Setup expected output
  const expectedNoMatches = ["!", "@"].map((symbol) => ({
    symbol,
    expected: null,
  }));

  // Negative - should find matches
  test.each(expectedNoMatches)(
    "Negative -> $symbol",
    ({ symbol, expected }) => {
      expect(lexSymbol(symbol, 0)).toStrictEqual(expected);
    }
  );
});
