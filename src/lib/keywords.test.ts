import { describe, expect, test } from "vitest";
import { lexKeyword, keywords } from "./lexer";

describe("lex keywords", () => {
  // Setup expected output
  const expectedMatches = keywords.map((keyword) => ({
    keyword,
    expected: {
      index: 0,
      type: "keyword",
      lexeme: keyword,
    },
  }));

  // Run Test Each - https://vitest.dev/api/#test-each

  // Positive - should find matches
  test.each(expectedMatches)(
    "Positive -> $keyword",
    ({ keyword, expected }) => {
      expect(lexKeyword(keyword, 0)).toStrictEqual(expected);
    }
  );
  // });

  // Setup expected output
  const expectedNoMatches = ["nor", "foo", ""].map((keyword) => ({
    keyword,
    expected: null,
  }));

  // Negative - should find matches
  test.each(expectedNoMatches)(
    "Negative -> $keyword",
    ({ keyword, expected }) => {
      expect(lexKeyword(keyword, 0)).toStrictEqual(expected);
    }
  );
});
