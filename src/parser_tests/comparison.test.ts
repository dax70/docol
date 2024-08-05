import { describe, expect, test } from "vitest";
import { parseOData } from "../lib/parser";

describe("Basic Comparison", () => {
  const comparisonOps = ["eq", "ne", "gt", "ge", "lt", "le"];

  // Setup expected output
  const expectedMatches = comparisonOps.map((op) => ({
    queryString: `$filter=name ${op} 'John'`,
    expected: {
      type: "Query",
      children: [
        {
          type: "Filter",
          value: {
            type: "Comparison",
            operator: op, // replace with parameter
            left: {
              type: "Identifier",
              value: "name",
            },
            right: {
              type: "StringLiteral",
              value: "John",
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
