import { describe, expect, test } from "vitest";
import { parseOData } from "../lib/parser";

describe("Select", () => {
  test("with - select", () => {
    const queryString =
      "$filter=(name eq 'John' or age gt 30) and city eq 'New York'&$select=name&$top=10";
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
          fields: ["name"],
        },
        {
          type: "Top",
          value: 10,
        },
      ],
    };

    expect(ast).toStrictEqual(expected);
  });

  test("select - name, age", () => {
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
      "$filter=(name eq 'John' or age ge 30) and city ne 'New York'&$select=name,age,city&$top=10&$skip=5&$orderby=name asc,age desc";

    const ast = parseOData(testQuery);
    // console.log(JSON.stringify(ast, null, 2));

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
                operator: "ge",
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
              operator: "ne",
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
          fields: ["name", "age", "city"],
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
