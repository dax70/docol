import { describe, expect, test } from "vitest";
import { tokenizeIdentifier } from "./tokenizer";

describe("lex identifiers - positive", () => {
  test("alpha", () => {
    expect(tokenizeIdentifier("alpha", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "alpha",
      },
      5,
    ]);
  });

  test("alpha_underscore", () => {
    expect(tokenizeIdentifier("alpha_underscore", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "alpha_underscore",
      },
      16,
    ]);
  });

  test("alpha123", () => {
    expect(tokenizeIdentifier("alpha123", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "alpha123",
      },
      8,
    ]);
  });
});

describe("lex identifiers - negative", () => {
  test("124", () => {
    expect(tokenizeIdentifier("123", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "123",
      },
      3,
    ]);
  });

  test("-alpha", () => {
    expect(tokenizeIdentifier("-alpha", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "",
      },
      0,
    ]);
  });

  test("empty", () => {
    expect(tokenizeIdentifier("", 0)).toStrictEqual([
      {
        position: 0,
        type: "Identifier",
        value: "",
      },
      0,
    ]);
  });
});
