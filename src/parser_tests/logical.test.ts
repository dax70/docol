import { describe, expect, test } from "vitest";
import { parseOData } from "../lib/parser";

describe("Basic Logical", () => {
  const logicalOp = ["and", "or"];

  // Setup expected output
  const expectedMatches = logicalOp.map((op) => ({
    queryString: `$filter=name eq 'John' ${op} age gt 30`,
    expected: {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "LogicalOp",
            operator: op, // replace with parameter
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
        },
      ],
    },
  }));

  test.each(expectedMatches)(
    "parse($queryString) -> $expected",
    ({ queryString, expected }) => {
      expect(parseOData(queryString)).toStrictEqual(expected);
    }
  );
});
