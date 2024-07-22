# @ubloimmo/front-tokens

[![npm version](https://badge.fury.io/js/@ubloimmo%2Ffront-tokens.svg)](https://badge.fury.io/js/@ubloimmo%2Ffront-tokens)

Internal library and private NPM package used to pull figma team styles from API
and export them into code-ready typescript & css tokens.


## Generating tokens

Want to convert figma values to code-ready tokens ? Here's how to do it!

### Prerequisites

This project uses typescript with [`Bun`](https://bun.sh) under the hood. *Thats it!*

Install it by following their [Installation guide](https://bun.sh/docs/installation).

### Installation

Clone the repository to your machine

```shell
git clone https://github.com/UbloImmo/front-tokens.git
```

Install all package dependencies

```shell
bun install
```

### Environment setup

Duplicate the provided ``.env.example`` file

```shell
cp .env.example .env
```

And populate is values.

| Variable name   | Value      | Description                            | Required |
|-----------------|------------|----------------------------------------|----------|
| FIGMA_TOKEN     | String     | Personal figma API token               | `true`   |
| FIGMA_TEAM_ID   | String     | Figma team ID                          | `true`   |
| FIGMA_FILE_URLS | CSV String | figma files URLS to filter team styles | `false`  |

Note: If `FIGMA_FILE_URLS` is not specified, all exported team styles will be converted to tokens.

### Updating tokens manually from the command line

Fetch styles from figma API and export tokens

```shell
bun update
```

#### Exports

Exported tokens are located in ``/lib`` directory under the following files and values.

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
|                             | assets                 | `readonly TokenValues`            | Nested object containing all asset tokens.        |
| `/lib/index.ts`             | ***All of the above*** |                                   |                                                   |

### Updating tokens from CI/CI pipeline

This repository already contains the `update.yml` GitHub workflow file
for all your automated updating needs.

**Note:** *The workflow only runs when triggered manually through the repository's [Actions tab](https://github.com/UbloImmo/front-tokens/actions/workflows/update.yml)*.

#### Pipeline steps

The pipeline fetches the most recent changes made to sourced figma files
and generates new code-ready tokens if needed.
If changes have been detected, a new commit will be made to `main` along with a version bump.

The resulting generated files will be published to [NPM](https://www.npmjs.com/package/@ubloimmo/front-tokens) and a new [Release](https://github.com/UbloImmo/front-tokens/releases) will be made available.

#### Running an update from CI

Go to `update.yml`'s [GitHub Action page](https://github.com/UbloImmo/front-tokens/actions/workflows/update.yml) and click on **Run workflow**.

## Consuming generated tokens

Generated tokens are made available to third-party Javascript / Typescript projects through a [private NPM package](https://www.npmjs.com/package/@ubloimmo/front-tokens).

### Installation

Install the package with the package manager of your choice

```shell
# NPM
npm install @ubloimmo/front-tokens
# Yarn
yarn add @ubloimmo/front-tokens
# Bun
bun add @ubloimmo/front-tokens
```

### Usage

Import the generated tokens in your code...

**Note:** *Imports are tree-shakable, refer to the [Exports](#exports) section for more information*

```typescript jsx
// Token groups and values, with detailed group information
import { COLOR, GRADIENT, EFFECT, ASSET, TEXT } from "@ubloimmo/front-tokens";
// Token groups and values, without detailed group information
import { colors, gradients, assets, texts, effects } from "@ubloimmo/front-tokens"
// Array containing all generated tokens, without grouping
import { tokens } from "@ubloimmo/front-tokens"
```

...and use them in your code

#### Typescript

```typescript
import { texts } from "@ubloimmo/front-tokens";

const isMobile: boolean = getIsMobile();
const SmallFontSize = texts[isMobile ? "mobile" : "desktop"].small.css.style.fontSize;
```

#### React component

```typescript jsx
import { colors } from "@ubloimmo/front-tokens";
import { useState, useMemo, useCallback } from "react";

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);
  
  const color = useMemo(
    () => isActive
      ? colors.ublo.main.value // rgba(90, 55, 216, 1)
      : colors.black.medium.value, // rgba(22, 22, 22, 1)
    [isActive]
  )
  
  const toggleActive = useCallback(
    () => setIsActive(!isActive),
    [setIsActive, isActive]
  )
  
  return (
    <div
      onClick={toggleActive}
      style={{ color }}
    >
      My text
    </div>
  )
}
```

#### Styled-components

```typescript jsx
import { texts, effects } from "@ubloimmo/tokens"

const H1 = styled.h1`
  ${texts.Desktop.H1.css.rules} // font-family: Avenir;\nfont-weight: 500;\nfont-size: 2.5rem;\nfont-style: normal;\ntext-indent: unset;\ntext-decoration: none;\ntext-transform: unset;\nline-height: 2.6524999618530276rem%;\nletter-spacing: -0.0625rem;\ntext-overflow: unset;\ntext-align: left;\nvertical-align: left;\nfont-feature-settings: normal;
`
const H1WithShadow = styled(H1)`
  box-shadow: ${effects.upfront.css.style.boxShadow}
`
```
