// TODO: add tabs
const whitespace = [" ", "\n", "\r"];

const numbers_regex = /^[0-9]+(\.[0-9]+)?/;

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
