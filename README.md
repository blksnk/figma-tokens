# @ubloimmo/front-tokens

Internal library and private NPM package used to pull figma team styles from API and export them into code-ready css tokens.

## Installation

Install all package dependencies

```bash
bun install
```

## Setup

Duplicate the provided ``.env.example`` file

```bash
cp .env.example .env
```

And populate is values.

| Variable name   | Value      | Description                            | Required |
|-----------------|------------|----------------------------------------|----------|
| FIGMA_TOKEN     | String     | Personal figma API token               | `true`   |
| FIGMA_TEAM_ID   | String     | Figma team ID                          | `true`   |
| FIGMA_FILE_URLS | CSV String | figma files URLS to filter team styles | `false`  |

Note: If `FIGMA_FILE_URLS` is not specified, all exported team styles will be converted to tokens.

## Usage

### Updating tokens manually from the command line

Fetch styles from figma API and export tokens

```bash
bun update
```

Exported tokens are located in ``/lib`` directory under the following files

| File name                   | Exported constants     | Type                              | Description                                       |
|-----------------------------|------------------------|-----------------------------------|---------------------------------------------------|
| `/lib/tokens.all.ts`        | tokens                 | `readonly Token[]`                | Array of all exported tokens                      |
| `/lib/tokens.collection.ts` | TEXT                   | `readonly TokenOrGroupCollection` | Hierarchy of all text tokens and token groups     |
|                             | GRADIENT               | `readonly TokenOrGroupCollection` | Hierarchy of all gradient tokens and token groups |
|                             | COLOR                  | `readonly TokenOrGroupCollection` | Hierarchy of all color tokens and token groups    |
|                             | EFFECT                 | `readonly TokenOrGroupCollection` | Hierarchy of all effect tokens and token groups   |
|                             | ASSET                  | `readonly TokenOrGroupCollection` | Hierarchy of all asset tokens and token groups    |
| `/lib/tokens.values.ts`     | texts                  | `readonly TokenValues`            | Nested object containing all text tokens.         |
|                             | gradients              | `readonly TokenValues`            | Nested object containing all gradient tokens.     |
|                             | colors                 | `readonly TokenValues`            | Nested object containing all color tokens.        |
|                             | effects                | `readonly TokenValues`            | Nested object containing all effect tokens.       |
|                             | asset                  | `readonly TokenValues`            | Nested object containing all asset tokens.        |
| `/lib/index.ts`             | ***All of the above*** |                                   |                                                   |
