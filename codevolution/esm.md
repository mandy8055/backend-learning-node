# ES Modules (ESM)

This note covers the ECMAScript Module (ESM) system, which is the official JavaScript standard for handling modules, now fully supported in Node.js.

## 1. Background

- **CommonJS (CJS):** The original Node.js module system (`module.exports` and `require`).
- **ES Modules (ESM):** The standardized system introduced in ES2015 (`export` and `import`).
- **Node.js Support:** ESM support became stable in Node.js version 14.

## 2. Enabling ES Modules

While the video mentions the `.mjs` extension as the primary way to trigger ESM, modern Node.js offers more flexibility:

- **File Extensions:** Files ending in `.mjs` are always treated as ES Modules.
- **package.json:** Adding `"type": "module"` to your `package.json` treats all `.js` files in that project as ES Modules.
- **Modern Node.js (v22+):** Node.js has significantly improved detection. It can often automatically detect the module type or allows for the `--experimental-detect-module` flag (in older versions) to run ESM code in `.js` files without explicit configuration.

## 3. Export Patterns

### Default Exports

Used when a module represents a single main thing (a class or a primary function).

- **Exporting:**
  ```javascript
  const add = (a, b) => a + b;
  export default add;
  // OR Inline:
  export default (a, b) => a + b;
  ```
- **Importing:**
  ```javascript
  import anyName from './math.js';
  // You can name a default import anything you like.
  ```

### Named Exports

Used when a module needs to export multiple functions or variables.

- **Exporting:**
  ```javascript
  export const add = (a, b) => a + b;
  export const subtract = (a, b) => a - b;
  ```
- **Importing:**
  - **Specific items:** `import { add, subtract } from './math.js';` (Names must match).
  - **Namespace import:** `import * as math from './math.js';` (Access via `math.add`).

## 4. Key Differences from CommonJS

| Feature            | CommonJS (CJS)                     | ES Modules (ESM)                                       |
| :----------------- | :--------------------------------- | :----------------------------------------------------- |
| **Keyword**        | `require` / `module.exports`       | `import` / `export`                                    |
| **Loading**        | Synchronous                        | Asynchronous                                           |
| **File Extension** | `.js` / `.cjs`                     | `.js` (with type: module) / `.mjs`                     |
| **Variables**      | Includes `__dirname`, `__filename` | These are not available in ESM (use `import.meta.url`) |

## 5. Summary of Import/Export Syntax

- **Default Export:** `export default ...` -> `import x from '...'`
- **Named Export:** `export const x = ...` -> `import { x } from '...'`
- **Hybrid:** A module can have one default export and multiple named exports.

### 6. [EXTRA] `--watch` mode:

- Using this we can get rid of any extra packages like `nodemon`
