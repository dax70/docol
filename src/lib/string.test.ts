import { describe, expect, test } from "vitest";
import { lexString } from "./lexer";

describe("lex string - positive", () => {
  test("hello", () => {
    expect(lexString('"hello"', 0)).toStrictEqual({
      index: 0,
      type: "string",
      lexeme: '"hello"',
    });
  });

  test("hello world", () => {
    expect(lexString('"hello world"', 0)).toStrictEqual({
      index: 0,
      type: "string",
      lexeme: '"hello world"',
    });
  });

  test("mixed 'hello'", () => {
    expect(lexString('"hello" ', 0)).toStrictEqual({
      index: 0,
      type: "string",
      lexeme: '"hello"',
    });
  });
});

describe("lex string - negative", () => {
  test("foo", () => {
    expect(lexString("foo", 0)).toStrictEqual(null);
  });

  test("onetwothreee", () => {
    expect(lexString("onetwothree", 0)).toStrictEqual(null);
  });

  test("empty", () => {
    expect(lexString("", 0)).toStrictEqual(null);
  });
});
