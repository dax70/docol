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

export let lexNumber = (source: string, index: number): Token | null => {
  let match = numbers_regex.test(source.slice(index));

  if (!match) {
    return null;
  }

  let lexeme = numbers_regex.exec(source.slice(index))![0];

  return { index, type: "number", lexeme };
};

// TODO: once we handle EOF, we can remove the `undefined` check
export let lexString = (source: string, index: number): Token | null => {
  if (source[index] !== '"') {
    return null;
  }

  let current = index + 1;

  while (true) {
    let char = source[current];

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

export let lexWhitespace = (source: string, index: number): Token | null => {
  let start = index;

  while (true) {
    let char = source[start];

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

export let lexSymbol = (source: string, index: number): Token | null => {
  for (let symbol of symbols) {
    if (source.startsWith(symbol, index)) {
      return { index, type: "symbol", lexeme: symbol };
    }
  }

  return null;
};

export let lexOperator = (source: string, index: number): Token | null => {
  for (let operator of operators) {
    if (source.startsWith(operator, index)) {
      return { index, type: "operator", lexeme: operator };
    }
  }

  return null;
};

export let lexKeyword = (source: string, index: number): Token | null => {
  for (let keyword of keywords) {
    if (source.startsWith(keyword, index)) {
      return { index, type: "keyword", lexeme: keyword };
    }
  }

  return null;
};

export let lexIdentifier = (source: string, index: number): Token | null => {
  let match = identifier_regex.test(source.slice(index));

  if (!match) {
    return null;
  }

  let lexeme = identifier_regex.exec(source.slice(index))![0];

  return { index, type: "identifier", lexeme };
};

let lexers = [
  lexWhitespace,
  lexKeyword,
  lexNumber,
  lexString,
  lexKeyword,
  lexSymbol,
  lexOperator,
  lexIdentifier,
];

export let lex = (source: string): Token[] => {
  let tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    for (let lexer of lexers) {
      let token = lexer(source, index);

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
