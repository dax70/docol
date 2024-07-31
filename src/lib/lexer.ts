// TODO: add tabs
const whitespace = [" ", "\n", "\r"];
const numbers_regex = /^[0-9]+(\.[0-9]+)?/;
const identifier_regex = /^[a-zA-Z_][a-zA-Z0-9_]*/;

export const keywords = [
  "filter",
  "orderby",
  "top",
  "limit",
  "skip",
  "expand",
  "select",
  "true",
  "false",
  "null",
];

export const symbols = [
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "=",
  ",",
  ":",
  ";",
  "&",
  "|",
];

export const operators = [
  "eq",
  "ne",
  "gt",
  "ge",
  "lt",
  "le",
  "and",
  "or",
  "not",
];

type Token = { index: number; lexeme: string } & (
  | { type: "operator" }
  | { type: "symbol" }
  | { type: "whitespace" }
  | { type: "string" }
  | { type: "number" }
  | { type: "keyword" }
  | { type: "identifier" }
);

export const lexNumber = (source: string, index: number): Token | null => {
  const match = numbers_regex.test(source.slice(index));

  if (!match) {
    return null;
  }

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const lexeme = numbers_regex.exec(source.slice(index))![0];

  return { index, type: "number", lexeme };
};

// TODO: once we handle EOF, we can remove the `undefined` check
export const lexString = (source: string, index: number): Token | null => {
  if (source[index] !== '"') {
    return null;
  }

  let current = index + 1;

  while (true) {
    const char = source[current];

    if (char === undefined) {
      return null; // TODO: error message
    }

    if (char === '"') {
      return {
        index,
        type: "string",
        lexeme: source.slice(index, current + 1),
      };
    }

    current++;
  }
};

export const lexWhitespace = (source: string, index: number): Token | null => {
  let start = index;

  while (true) {
    const char = source[start];

    if (char && whitespace.includes(char)) {
      start++;
      continue;
    }

    break;
  }

  // No token found if cursor is at the same position
  if (start === index) {
    return null;
  }

  return { index, type: "whitespace", lexeme: source.slice(index, start) };
};

export const lexSymbol = (source: string, index: number): Token | null => {
  for (const symbol of symbols) {
    if (source.startsWith(symbol, index)) {
      return { index, type: "symbol", lexeme: symbol };
    }
  }

  return null;
};

export const lexOperator = (source: string, index: number): Token | null => {
  for (const operator of operators) {
    if (source.startsWith(operator, index)) {
      return { index, type: "operator", lexeme: operator };
    }
  }

  return null;
};

export const lexKeyword = (source: string, index: number): Token | null => {
  for (const keyword of keywords) {
    if (source.startsWith(keyword, index)) {
      return { index, type: "keyword", lexeme: keyword };
    }
  }

  return null;
};

export const lexIdentifier = (source: string, index: number): Token | null => {
  const match = identifier_regex.test(source.slice(index));

  if (!match) {
    return null;
  }

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const lexeme = identifier_regex.exec(source.slice(index))![0];

  return { index, type: "identifier", lexeme };
};

const lexers = [
  lexWhitespace,
  lexKeyword,
  lexNumber,
  lexString,
  lexKeyword,
  lexSymbol,
  lexOperator,
  lexIdentifier,
];

export const lex = (source: string): Token[] => {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    for (const lexer of lexers) {
      const token = lexer(source, index);

      if (token) {
        tokens.push(token);
        index += token.lexeme.length;
        break;
      }
    }

    // throw Error(`Unexpected char at ${index}`);
  }

  return tokens;
};
