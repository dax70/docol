# D0COL Library

This is a minimalist data filtering library, for developing applications that need to filter, sort and page data.

## Goals

Be able to use query syntax to simplify and standardize app endpoints/routes

Ex:

```URI
/products?filter=product/price gt 100 & top=50
```

Pagination

```URI
/products?filter=product/price gt 100 & top=50 & skip=50
```

> Should product an AST to apply to a backend as needed.

For example it could be applied to an existing API or to add to an SQL prepared statement or manipulate ORM or QueryBuilder APIs such as Drizzle or Kysely.

## Development TODOs

[ ] Finish Tokenizer
[ ] Build Parser
[ ] Create sample integrations to use with Remix and easy to apply to Drizzle
[ ] Publish to npm

## Documentation

[ ] Write docs after getting some prod use

> Check out the [ODATA](https://www.odata.org/) if you would like to use something that is a specification.

## Getting started

First, let's install all dependencies:

```bash
pnpm i
```

When you're ready to build and use your new `npm` package, run:

```bash
pnpm build
```
