import { describe, expect, test } from "vitest";
import { lexIdentifier } from "./lexer";

describe("lex identifiers - positive", () => {
  test("alpha", () => {
    expect(lexIdentifier("alpha", 0)).toStrictEqual({
      index: 0,
      type: "identifier",
      lexeme: "alpha",
    });
  });

  test("alpha_underscore", () => {
    expect(lexIdentifier("alpha_underscore", 0)).toStrictEqual({
      index: 0,
      type: "identifier",
      lexeme: "alpha_underscore",
    });
  });

  test("alpha123", () => {
    expect(lexIdentifier("alpha123", 0)).toStrictEqual({
      index: 0,
      type: "identifier",
      lexeme: "alpha123",
    });
  });
});

describe("lex identifiers - negative", () => {
  test("124", () => {
    expect(lexIdentifier("123", 0)).toStrictEqual(null);
  });

  test("-alpha", () => {
    expect(lexIdentifier("-alpha", 0)).toStrictEqual(null);
  });

  test("empty", () => {
    expect(lexIdentifier("", 0)).toStrictEqual(null);
  });
});
