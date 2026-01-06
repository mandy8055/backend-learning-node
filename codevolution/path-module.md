# Path Module

The `path` module provides utilities for working with file and directory paths. Since it is a built-in module, you don't need to install it via npm.

---

## 1. Importing the Module

It is recommended to use the `node:` prefix to explicitly indicate it is a built-in module.

```javascript
// CommonJS (CJS)
const path = require('node:path');

// ES Modules (ESM)
import path from 'node:path';
```

---

## 2. File & Directory Paths (CJS vs ESM)

Node.js provides ways to get the current file and directory path. The method differs significantly between module systems.

### CommonJS (CJS)

Uses globally available variables provided by the module wrapper:

- `__filename`: Full path to the current file.
- `__dirname`: Full path to the current directory.

### ES Modules (ESM)

In ESM, the global `__filename` and `__dirname` are not available.

**Modern Approach (Node.js v20.11.0+):**

You can now simply use `import.meta` to get these values directly:

```javascript
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

console.log(__filename);
console.log(__dirname);
```

---

## 3. Essential Path Methods

### `path.basename(path)`

Returns the last portion of a path (the filename).

- **Example:** `path.basename(__filename)` → `index.js`

### `path.extname(path)`

Returns the extension of the file.

- **Example:** `path.extname(__filename)` → `.js`

### `path.parse(path)`

Returns a useful object representing the path components.

- **Example:** `path.parse(__filename)`
- **Output:** `{ root: '/', dir: '...', base: 'index.js', ext: '.js', name: 'index' }`

### `path.format(pathObject)`

The opposite of `parse`; it returns a path string when provided with a path object.

### `path.isAbsolute(path)`

Returns a boolean indicating if the provided path is absolute.

### `path.join(...paths)`

Joins multiple path segments using the platform-specific separator (`/` or `\`). It also normalizes the path (removes extra slashes).

- **Example:** `path.join('folder1', 'folder2', 'index.html')` → `folder1/folder2/index.html`

### `path.resolve(...paths)`

Resolves a sequence of paths into an absolute path.

- If an absolute path isn't reached after joining all segments, it prepends the current working directory.
- **Example:** `path.resolve('folder1', 'folder2', 'index.html')` → `/Users/name/project/folder1/folder2/index.html`

---

## 4. Key Takeaways

- **Platform Independence:** Always use `path.join()` or `path.resolve()` instead of manual string concatenation (like `folder/` + `file`) to ensure your code works on both Windows and POSIX (Mac/Linux) systems.
- **Prefixing:** Use `node:path` to distinguish built-in modules from third-party packages.
- **ESM Compatibility:** If you are using ES Modules, prefer `import.meta.dirname` over the older, complex `fileURLToPath` workarounds.

---
