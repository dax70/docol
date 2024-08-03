import { describe, expect, test } from "vitest";
import { tokenizeNumber } from "./tokenizer";

describe("lex numbers - positive", () => {
  test("one", () => {
    expect(tokenizeNumber("1", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "1",
      },
      1,
    ]);
  });

  test("two", () => {
    expect(tokenizeNumber("12", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "12",
      },
      2,
    ]);
  });

  test("three", () => {
    expect(tokenizeNumber("123", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "123",
      },
      3,
    ]);
  });

  test("mixed 1", () => {
    expect(tokenizeNumber("1 ", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "1",
      },
      1,
    ]);
  });

  test("mixed 2", () => {
    expect(tokenizeNumber("12 ", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "12",
      },
      2,
    ]);
  });
});

describe("lex numbers - negative", () => {
  test("foo", () => {
    expect(tokenizeNumber("foo", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "",
      },
      0,
    ]);
  });

  test("onetwothreee", () => {
    expect(tokenizeNumber("onetwothree", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "",
      },
      0,
    ]);
  });

  test("empty", () => {
    expect(tokenizeNumber("", 0)).toStrictEqual([
      {
        position: 0,
        type: "Number",
        value: "",
      },
      0,
    ]);
  });
});
