import { describe, expect, test } from "vitest";
import { lexWhitespace } from "./lexer";

describe("lex whitespace - positive", () => {
  test("single", () => {
    expect(lexWhitespace(" ", 0)).toStrictEqual({
      index: 0,
      type: "whitespace",
      lexeme: " ",
    });
  });

  test("two spaces", () => {
    expect(lexWhitespace("  ", 0)).toStrictEqual({
      index: 0,
      type: "whitespace",
      lexeme: "  ",
    });
  });

  test("three spaces", () => {
    expect(lexWhitespace("   ", 0)).toStrictEqual({
      index: 0,
      type: "whitespace",
      lexeme: "   ",
    });
  });

  test("mixed 1", () => {
    expect(lexWhitespace(" e", 0)).toStrictEqual({
      index: 0,
      type: "whitespace",
      lexeme: " ",
    });
  });

  test("mixed 2", () => {
    expect(lexWhitespace("  e", 0)).toStrictEqual({
      index: 0,
      type: "whitespace",
      lexeme: "  ",
    });
  });
});

describe("lex whitespace - negative", () => {
  test("foo", () => {
    expect(lexWhitespace("foo", 0)).toStrictEqual(null);
  });

  test("123", () => {
    expect(lexWhitespace("123", 0)).toStrictEqual(null);
  });

  test("empty", () => {
    expect(lexWhitespace("", 0)).toStrictEqual(null);
  });
});
