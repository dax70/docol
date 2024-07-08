import { describe, expect, test } from "vitest";
import { lex } from "./lexer";

describe("lex", () => {
  // filter=ProductDate eq "2021-01-01"
  /*
 [keyword("filter"), 
  symbol("="), 
  identifier("ProductDate"), 
  whitespace(" "),
  operator(eq), 
  whitespace(" "),
  string("2021-01-01")
  ]
*/
  test("basic filter", () => {
    const result = lex('filter=ProductDate eq "2021-01-01"');
    expect(result).toStrictEqual([
      { index: 0, type: "keyword", lexeme: "filter" },
      { index: 6, type: "symbol", lexeme: "=" },
      { index: 7, type: "identifier", lexeme: "ProductDate" },
      { index: 18, type: "whitespace", lexeme: " " },
      { index: 19, type: "operator", lexeme: "eq" },
      { index: 21, type: "whitespace", lexeme: " " },
      { index: 22, type: "string", lexeme: '"2021-01-01"' },
    ]);
  });

  // top=5
  /*
  [keyword("top"), 
  symbol("="), 
  number("5")]
*/
  test("basic top", () => {
    const result = lex("top=5");
    expect(result).toStrictEqual([
      { index: 0, type: "keyword", lexeme: "top" },
      { index: 3, type: "symbol", lexeme: "=" },
      { index: 4, type: "number", lexeme: "5" },
    ]);
  });

  // skip=3
  test("basic skip", () => {
    const result = lex("skip=3");
    expect(result).toStrictEqual([
      { index: 0, type: "keyword", lexeme: "skip" },
      { index: 4, type: "symbol", lexeme: "=" },
      { index: 5, type: "number", lexeme: "3" },
    ]);
  });

  // limit=7
  test("basic limit", () => {
    const result = lex("limit=7");
    expect(result).toStrictEqual([
      { index: 0, type: "keyword", lexeme: "limit" },
      { index: 5, type: "symbol", lexeme: "=" },
      { index: 6, type: "number", lexeme: "7" },
    ]);
  });

  // filter=ProductDate eq "2021-01-01"&top=5&skip=3&limit=7'
  /*
 [
  keyword("filter"), 
  symbol("="), 
  identifier("ProductDate"), 
  whitespace(" "),
  operator(eq), 
  whitespace(" "),
  string("2021-01-01"),
  symbol("&"), 
  keyword("top"),
  symbol("="),
  number("5"),
  symbol("&"),
  keyword("skip"),
  symbol("="),
  number("3"),
  ]
*/
  test("composite", () => {
    const result = lex(
      'filter=ProductDate eq "2021-01-01"&top=5&skip=3&limit=7'
    );
    expect(result).toStrictEqual([
      { index: 0, type: "keyword", lexeme: "filter" },
      { index: 6, type: "symbol", lexeme: "=" },
      { index: 7, type: "identifier", lexeme: "ProductDate" },
      { index: 18, type: "whitespace", lexeme: " " },
      { index: 19, type: "operator", lexeme: "eq" },
      { index: 21, type: "whitespace", lexeme: " " },
      { index: 22, type: "string", lexeme: '"2021-01-01"' },
      { index: 34, type: "symbol", lexeme: "&" },
      { index: 35, type: "keyword", lexeme: "top" },
      { index: 38, type: "symbol", lexeme: "=" },
      { index: 39, type: "number", lexeme: "5" },
      { index: 40, type: "symbol", lexeme: "&" },
      { index: 41, type: "keyword", lexeme: "skip" },
      { index: 45, type: "symbol", lexeme: "=" },
      { index: 46, type: "number", lexeme: "3" },
      { index: 47, type: "symbol", lexeme: "&" },
      { index: 48, type: "keyword", lexeme: "limit" },
      { index: 53, type: "symbol", lexeme: "=" },
      { index: 54, type: "number", lexeme: "7" },
    ]);
  });
});
