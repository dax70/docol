export type TokenType =
  | "Identifier"
  | "Number"
  | "String"
  | "Equals"
  | "NotEquals"
  | "GreaterThan"
  | "GreaterThanOrEqual"
  | "LessThan"
  | "LessThanOrEqual"
  | "And"
  | "Or"
  | "Not"
  | "LeftParen"
  | "RightParen"
  | "Comma"
  | "Dollar"
  | "Ampersand"
  | "EOF";

export type Token = {
  type: TokenType;
  value: string;
  position: number;
};

// Lexer
const isAlpha = (c: string): boolean => /[a-zA-Z]/.test(c);
const isDigit = (c: string): boolean => /[0-9]/.test(c);
const isAlphaNumeric = (c: string): boolean => isAlpha(c) || isDigit(c);

export const operators = [
  ["eq", "Equals"],
  ["ne", "NotEquals"],
  ["gt", "GreaterThan"],
  ["ge", "GreaterThanOrEqual"],
  ["lt", "LessThan"],
  ["le", "LessThanOrEqual"],
  ["and", "And"],
  ["or", "Or"],
  ["not", "Not"],
];

export const tokenizeIdentifier = (
  input: string,
  position: number
): [Token, number] => {
  let end = position;
  while (
    end < input.length &&
    (isAlphaNumeric(input[end]) || input[end] === "_")
  ) {
    end++;
  }

  const value = input.slice(position, end);
  let type: TokenType = "Identifier";

  switch (value) {
    case "eq":
      type = "Equals";
      break;
    case "ne":
      type = "NotEquals";
      break;
    case "gt":
      type = "GreaterThan";
      break;
    case "ge":
      type = "GreaterThanOrEqual";
      break;
    case "lt":
      type = "LessThan";
      break;
    case "le":
      type = "LessThanOrEqual";
      break;
    case "and":
      type = "And";
      break;
    case "or":
      type = "Or";
      break;
    case "not":
      type = "Not";
      break;
  }

  return [{ type, value, position }, end];
};

export const tokenizeNumber = (
  input: string,
  position: number
): [Token, number] => {
  let end = position;

  while (end < input.length && isDigit(input[end])) {
    end++;
  }

  if (input[end] === "." && isDigit(input[end + 1])) {
    end += 2;
    while (end < input.length && isDigit(input[end])) {
      end++;
    }
  }

  return [{ type: "Number", value: input.slice(position, end), position }, end];
};

export const tokenizeString = (
  input: string,
  position: number
): [Token, number] => {
  let end = position + 1;

  while (end < input.length && input[end] !== "'") {
    end++;
  }

  if (end === input.length) {
    throw new Error(`Unterminated string at position ${position}`);
  }

  return [
    { type: "String", value: input.slice(position + 1, end), position },
    end + 1,
  ];
};

export const tokenizeOperator = (
  input: string,
  position: number
): [Token, number] => {
  switch (input[position]) {
    case "'":
      return tokenizeString(input, position);
    case "(":
      return [{ type: "LeftParen", value: "(", position }, position + 1];
    case ")":
      return [{ type: "RightParen", value: ")", position }, position + 1];
    case ",":
      return [{ type: "Comma", value: ",", position }, position + 1];
    case "$":
      return [{ type: "Dollar", value: "$", position }, position + 1];
    case "=":
      return [{ type: "Equals", value: "=", position }, position + 1];
    case "&":
      return [{ type: "Ampersand", value: "&", position }, position + 1];
    default:
      throw new Error(
        `Unexpected character '${input[position]}' at position ${position}`
      );
  }
};

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let position = 0;

  while (position < input.length) {
    if (/\s/.test(input[position])) {
      position++;
      continue;
    }

    if (isAlpha(input[position])) {
      const [token, newPos] = tokenizeIdentifier(input, position);
      tokens.push(token);
      position = newPos;
    } else if (isDigit(input[position])) {
      const [token, newPos] = tokenizeNumber(input, position);
      tokens.push(token);
      position = newPos;
    } else {
      const [token, newPos] = tokenizeOperator(input, position);
      tokens.push(token);
      position = newPos;
    }
  }

  tokens.push({ type: "EOF", value: "", position: input.length });
  return tokens;
};
