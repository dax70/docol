import { describe, expect, test } from "vitest";
import { lexOperator, operators } from "./lexer";

describe("lex operators", () => {
  // Setup expected output
  const expectedMatches = operators.map((op) => ({
    op,
    expected: {
      index: 0,
      type: "operator",
      lexeme: op,
    },
  }));

  // Run Test Each - https://vitest.dev/api/#test-each

  // Positive - should find matches
  test.each(expectedMatches)("Positive -> $op", ({ op, expected }) => {
    expect(lexOperator(op, 0)).toStrictEqual(expected);
  });
  // });

  // Setup expected output
  const expectedNoMatches = [
    "nor",
    "foo",
    // "eqq",
    // "neq",
    // "g",
    // "geq",
    // "ltt",
    // "lee",
    // "andd",
    // "orr",
    // "nott",
    // "eq ",
    // " eq",
    // "eq=",
    // " eq ",
  ].map((op) => ({
    op,
    expected: null,
  }));

  // Negative - should find matches
  test.each(expectedNoMatches)("Negative -> $op", ({ op, expected }) => {
    expect(lexOperator(op, 0)).toStrictEqual(expected);
  });
});
