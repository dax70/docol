import type { Token, TokenType } from "./tokenizer";
import { tokenize } from "./tokenizer";

export type ASTNode =
  | { type: "Query"; children: ASTNode[] }
  | { type: "Filter"; value: ASTNode }
  | { type: "Select"; fields: string[] }
  | { type: "Top"; value: number }
  | { type: "Skip"; value: number }
  | {
      type: "OrderBy";
      fields: Array<{ field: string; direction: "asc" | "desc" }>;
    }
  | { type: "Comparison"; operator: string; left: ASTNode; right: ASTNode }
  | { type: "LogicalOp"; operator: string; left: ASTNode; right: ASTNode }
  | { type: "Identifier"; value: string }
  | { type: "StringLiteral"; value: string }
  | { type: "NumberLiteral"; value: number };

// Parser
type ParserState = {
  tokens: Token[];
  current: number;
};

const peek = (state: ParserState): Token => state.tokens[state.current];

const previous = (state: ParserState): Token => state.tokens[state.current - 1];

const isAtEnd = (state: ParserState): boolean => peek(state).type === "EOF";

const check = (state: ParserState, type: TokenType): boolean =>
  !isAtEnd(state) && peek(state).type === type;

const advance = (state: ParserState): ParserState => ({
  ...state,
  current: state.current + 1,
});

const match = (
  state: ParserState,
  ...types: TokenType[]
): [boolean, ParserState] => {
  for (const type of types) {
    if (check(state, type)) {
      return [true, advance(state)];
    }
  }

  return [false, state];
};

const consume = (
  state: ParserState,
  type: TokenType,
  message: string
): [Token, ParserState] => {
  if (check(state, type)) {
    return [peek(state), advance(state)];
  }

  throw new Error(`${message} at position ${peek(state).position}`);
};

const parseSelectFields = (state: ParserState): [string[], ParserState] => {
  const fields: string[] = [];
  let currentState = state;

  do {
    const [token, newState] = consume(
      currentState,
      "Identifier",
      "Expected field name"
    );
    fields.push(token.value);
    currentState = newState;

    const [matched, matchState] = match(currentState, "Comma");
    if (matched) {
      currentState = matchState;
    } else {
      break;
    }
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
  } while (true);

  return [fields, currentState];
};

const parseOrderByFields = (
  state: ParserState
): [Array<{ field: string; direction: "asc" | "desc" }>, ParserState] => {
  const fields: Array<{ field: string; direction: "asc" | "desc" }> = [];
  let currentState = state;

  do {
    const [token, afterField] = consume(
      currentState,
      "Identifier",
      "Expected field name"
    );

    let direction: "asc" | "desc" = "asc";
    let afterDirection = afterField;

    const [directionMatched, afterDirectionToken] = match(
      afterField,
      "Identifier"
    );

    if (
      directionMatched &&
      ["asc", "desc"].includes(previous(afterDirectionToken).value)
    ) {
      direction = previous(afterDirectionToken).value as "asc" | "desc";
      afterDirection = afterDirectionToken;
    }

    fields.push({ field: token.value, direction });
    currentState = afterDirection;

    const [commaMatched, afterComma] = match(currentState, "Comma");

    if (commaMatched) {
      currentState = afterComma;
    } else {
      break;
    }
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
  } while (true);

  return [fields, currentState];
};

const parsePrimary = (state: ParserState): [ASTNode, ParserState] => {
  const [matched, newState] = match(state, "Identifier", "String", "Number");

  if (matched) {
    const token = previous(newState);

    switch (token.type) {
      case "Identifier":
        return [{ type: "Identifier", value: token.value }, newState];
      case "String":
        return [{ type: "StringLiteral", value: token.value }, newState];
      case "Number":
        return [
          { type: "NumberLiteral", value: Number(token.value) },
          newState,
        ];
    }
  }

  throw new Error(
    `Unexpected token ${peek(state).value} at position ${peek(state).position}`
  );
};

const parseComparison = (state: ParserState): [ASTNode, ParserState] => {
  const [leftParenMatched, afterLeftParen] = match(state, "LeftParen");

  if (leftParenMatched) {
    const [expr, afterExpr] = parseExpression(afterLeftParen);

    const [, afterRightParen] = consume(
      afterExpr,
      "RightParen",
      "Expected ')' after expression"
    );

    return [expr, afterRightParen];
  }

  const [left, afterLeft] = parsePrimary(state);

  const [opMatched, afterOp] = match(
    afterLeft,
    "Equals",
    "NotEquals",
    "GreaterThan",
    "GreaterThanOrEqual",
    "LessThan",
    "LessThanOrEqual"
  );

  if (opMatched) {
    const operator = previous(afterOp).value;
    const [right, afterRight] = parsePrimary(afterOp);
    return [{ type: "Comparison", operator, left, right }, afterRight];
  }

  return [left, afterLeft];
};

const parseLogicalAnd = (state: ParserState): [ASTNode, ParserState] => {
  let [expr, currentState] = parseComparison(state);

  while (true) {
    const [matched, afterAnd] = match(currentState, "And");

    if (!matched) break;

    const [right, afterRight] = parseComparison(afterAnd);
    expr = { type: "LogicalOp", operator: "and", left: expr, right };
    currentState = afterRight;
  }

  return [expr, currentState];
};

const parseLogicalOr = (state: ParserState): [ASTNode, ParserState] => {
  let [expr, currentState] = parseLogicalAnd(state);

  while (true) {
    const [matched, afterOr] = match(currentState, "Or");

    if (!matched) break;

    const [right, afterRight] = parseLogicalAnd(afterOr);
    expr = { type: "LogicalOp", operator: "or", left: expr, right };
    currentState = afterRight;
  }

  return [expr, currentState];
};

const parseExpression = (state: ParserState): [ASTNode, ParserState] => {
  return parseLogicalOr(state);
};

const parseQuery = (state: ParserState): ASTNode => {
  const children: ASTNode[] = [];
  let currentState = state;

  while (!isAtEnd(currentState)) {
    const [dollarMatched, afterDollar] = match(currentState, "Dollar");

    // OData expects Options prefixed with $
    // https://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/part1-protocol/odata-v4.0-errata03-os-part1-protocol-complete.html#_Toc453752212
    // Followed by an "=" sign
    if (dollarMatched) {
      const [identifierToken, afterIdentifier] = consume(
        afterDollar,
        "Identifier",
        "Expected identifier after $"
      );

      const option = identifierToken.value;

      const [, afterEquals] = consume(
        afterIdentifier,
        "Equals",
        `Expected '=' after $${option}`
      );

      switch (option) {
        case "filter":
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const [filterExpr, afterFilter] = parseExpression(afterEquals);
          children.push({ type: "Filter", value: filterExpr });
          currentState = afterFilter;
          break;
        case "select":
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const [selectFields, afterSelect] = parseSelectFields(afterEquals);
          children.push({ type: "Select", fields: selectFields });
          currentState = afterSelect;
          break;
        case "top":
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const [topToken, afterTop] = consume(
            afterEquals,
            "Number",
            "Expected number after $top="
          );
          children.push({ type: "Top", value: Number(topToken.value) });
          currentState = afterTop;
          break;
        case "skip":
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const [skipToken, afterSkip] = consume(
            afterEquals,
            "Number",
            "Expected number after $skip="
          );
          children.push({ type: "Skip", value: Number(skipToken.value) });
          currentState = afterSkip;
          break;
        case "orderby":
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const [orderByFields, afterOrderBy] = parseOrderByFields(afterEquals);
          children.push({ type: "OrderBy", fields: orderByFields });
          currentState = afterOrderBy;
          break;
        default:
          throw new Error(`Unexpected query option $${option}`);
      }
    } else {
      throw new Error(
        `Unexpected token ${peek(currentState).value} at position ${
          peek(currentState).position
        }`
      );
    }

    // Check for more query options
    const [ampersandMatched, afterAmpersand] = match(currentState, "Ampersand");
    if (ampersandMatched) {
      currentState = afterAmpersand;
    } else {
      break;
    }
  }

  return { type: "Query", children };
};

const parse = (tokens: Token[]): ASTNode => {
  return parseQuery({ tokens, current: 0 });
};

// Main parsing function
export const parseOData = (input: string): ASTNode => {
  const tokens = tokenize(input);
  return parse(tokens);
};
