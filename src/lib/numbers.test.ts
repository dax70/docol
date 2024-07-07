import { describe, expect, test } from "vitest";
import { lexNumber } from "./lexer";

describe("lex numbers - positive", () => {
  test("one", () => {
    expect(lexNumber("1", 0)).toStrictEqual({
      index: 0,
      type: "number",
      lexeme: "1",
    });
  });

  test("two", () => {
    expect(lexNumber("12", 0)).toStrictEqual({
      index: 0,
      type: "number",
      lexeme: "12",
    });
  });

  test("three", () => {
    expect(lexNumber("123", 0)).toStrictEqual({
      index: 0,
      type: "number",
      lexeme: "123",
    });
  });

  test("mixed 1", () => {
    expect(lexNumber("1 ", 0)).toStrictEqual({
      index: 0,
      type: "number",
      lexeme: "1",
    });
  });

  test("mixed 2", () => {
    expect(lexNumber("12 ", 0)).toStrictEqual({
      index: 0,
      type: "number",
      lexeme: "12",
    });
  });
});

describe("lex numbers - negative", () => {
  test("foo", () => {
    expect(lexNumber("foo", 0)).toStrictEqual(null);
  });

  test("onetwothreee", () => {
    expect(lexNumber("onetwothree", 0)).toStrictEqual(null);
  });

  test("empty", () => {
    expect(lexNumber("", 0)).toStrictEqual(null);
  });
});
