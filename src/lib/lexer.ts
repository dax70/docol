// TODO: add tabs
const whitespace = [" ", "\n", "\r"];
const numbers_regex = /^[0-9]+(\.[0-9]+)?/;
const identifier_regex = /^[a-zA-Z_][a-zA-Z0-9_]*/;

export const keywords = ["filter", "orderby", "top", "limit", "skip", "expand"];

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
