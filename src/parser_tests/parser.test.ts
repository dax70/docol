import { describe, expect, test } from "vitest";
import { parseOData } from "../lib/parser";

describe("parser tests", () => {
  test("simple - or with and", () => {
    const queryString =
      "$filter=name eq 'John' or age gt 30 and city eq 'New York'";
    const ast = parseOData(queryString);

    const expected = {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "LogicalOp",
            operator: "or",
            left: {
              type: "Comparison",
              operator: "eq",
              left: {
                type: "Identifier",
                value: "name",
              },
              right: {
                type: "StringLiteral",
                value: "John",
              },
            },
            right: {
              type: "LogicalOp",
              operator: "and",
              left: {
                type: "Comparison",
                operator: "gt",
                left: {
                  type: "Identifier",
                  value: "age",
                },
                right: {
                  type: "NumberLiteral",
                  value: 30,
                },
              },
              right: {
                type: "Comparison",
                operator: "eq",
                left: {
                  type: "Identifier",
                  value: "city",
                },
                right: {
                  type: "StringLiteral",
                  value: "New York",
                },
              },
            },
          },
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });

  test("simple - and with or", () => {
    const queryString =
      "$filter=name eq 'John' and age gt 30 or city eq 'New York'";
    const ast = parseOData(queryString);

    console.log(JSON.stringify(ast, null, 2));
    const expected = {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "LogicalOp",
            operator: "or",
            left: {
              type: "LogicalOp",
              operator: "and",
              left: {
                type: "Comparison",
                operator: "eq",
                left: {
                  type: "Identifier",
                  value: "name",
                },
                right: {
                  type: "StringLiteral",
                  value: "John",
                },
              },
              right: {
                type: "Comparison",
                operator: "gt",
                left: {
                  type: "Identifier",
                  value: "age",
                },
                right: {
                  type: "NumberLiteral",
                  value: 30,
                },
              },
            },
            right: {
              type: "Comparison",
              operator: "eq",
              left: {
                type: "Identifier",
                value: "city",
              },
              right: {
                type: "StringLiteral",
                value: "New York",
              },
            },
          },
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });

  test("with - select", () => {
    const queryString =
      "$filter=(name eq 'John' or age gt 30) and city eq 'New York'&$select=name,age&$top=10";
    const ast = parseOData(queryString);

    const expected = {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "LogicalOp",
            operator: "and",
            left: {
              type: "LogicalOp",
              operator: "or",
              left: {
                type: "Comparison",
                operator: "eq",
                left: {
                  type: "Identifier",
                  value: "name",
                },
                right: {
                  type: "StringLiteral",
                  value: "John",
                },
              },
              right: {
                type: "Comparison",
                operator: "gt",
                left: {
                  type: "Identifier",
                  value: "age",
                },
                right: {
                  type: "NumberLiteral",
                  value: 30,
                },
              },
            },
            right: {
              type: "Comparison",
              operator: "eq",
              left: {
                type: "Identifier",
                value: "city",
              },
              right: {
                type: "StringLiteral",
                value: "New York",
              },
            },
          },
        },
        {
          type: "Select",
          fields: ["name", "age"],
        },
        {
          type: "Top",
          value: 10,
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });

  test("with - select", () => {
    const queryString =
      "$filter=name eq 'John' or (age gt 30 and city eq 'New York')&$select=name,age&$top=10";
    const ast = parseOData(queryString);

    const expected = {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "LogicalOp",
            operator: "or",
            left: {
              type: "Comparison",
              operator: "eq",
              left: {
                type: "Identifier",
                value: "name",
              },
              right: {
                type: "StringLiteral",
                value: "John",
              },
            },
            right: {
              type: "LogicalOp",
              operator: "and",
              left: {
                type: "Comparison",
                operator: "gt",
                left: {
                  type: "Identifier",
                  value: "age",
                },
                right: {
                  type: "NumberLiteral",
                  value: 30,
                },
              },
              right: {
                type: "Comparison",
                operator: "eq",
                left: {
                  type: "Identifier",
                  value: "city",
                },
                right: {
                  type: "StringLiteral",
                  value: "New York",
                },
              },
            },
          },
        },
        {
          type: "Select",
          fields: ["name", "age"],
        },
        {
          type: "Top",
          value: 10,
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });

  test("test - advanced", () => {
    const testQuery =
      "$filter=(name eq 'John' or age ge 30) and city ne 'New York'&$select=name,age&$top=10&$skip=5&$orderby=name asc,age desc";

    const ast = parseOData(testQuery);
    // console.log(JSON.stringify(ast, null, 2));

    const expected = {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            left: {
              left: {
                left: {
                  type: "Identifier",
                  value: "name",
                },
                operator: "eq",
                right: {
                  type: "StringLiteral",
                  value: "John",
                },
                type: "Comparison",
              },
              operator: "or",
              right: {
                left: {
                  type: "Identifier",
                  value: "age",
                },
                operator: "ge",
                right: {
                  type: "NumberLiteral",
                  value: 30,
                },
                type: "Comparison",
              },
              type: "LogicalOp",
            },
            operator: "and",
            right: {
              left: {
                type: "Identifier",
                value: "city",
              },
              operator: "ne",
              right: {
                type: "StringLiteral",
                value: "New York",
              },
              type: "Comparison",
            },
            type: "LogicalOp",
          },
        },
        {
          type: "Select",
          fields: ["name", "age"],
        },
        {
          type: "Top",
          value: 10,
        },
        {
          type: "Skip",
          value: 5,
        },
        {
          type: "OrderBy",
          fields: [
            {
              direction: "asc",
              field: "name",
            },
            {
              direction: "desc",
              field: "age",
            },
          ],
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });
});
