# Day 1 Notes

## What is Node.js?

1. What makes Node.js different from running JavaScript in Chrome?

   There are mainly 3 differences between NodeJs and browser environment:
   1. There are APIs which are available in browser through `window` and `document` objects which is not available in NodeJs and similarly there are APIs which handles filesystems which are available in NodeJs but not in browser.
   2. In NodeJs we can use both commonJs and module syntax i.e. `import` and `require` but in in browser we mainly use module syntax.
   3. It is easier to define the environment of NodeJs since we can control that our nodejs application runs on which version and all so we can use the latest es features which is supported by that version, but we cannot do the same for browser since we cannot know which browser our end-users use. We need babel in browser for overcoming this limitation which we do not need for NodeJs.

2. What does "Node.js is built on V8" mean?

   When it is said that "Node.js is built on V8", it means the Javascript engine that actually executes code written in Javascript is parsed, compiled and executed by V8 engine. In simpler words, inside the NodeJs runtime, the Javascript engine is V8.(Extra information: v8 is written in c++)

3. Why is Node.js good for I/O operations but bad for CPU-intensive tasks?

   **I/O (Input/Output):** Node.js is excellent for I/O because it is **Non-blocking**. When Node.js requests a file or database entry, it hands the task to the OS and continues executing other code. It handles the result via the Event Loop once ready.
   **CPU-Intensive:** Node.js is bad for heavy computation (e.g., video encoding, complex math). Since JS runs on a **single main thread**, a heavy calculation will "block" the thread, preventing the server from responding to any other requests until the math is finished.

4. What are some examples of things Node.js can do that browser JavaScript cannot?
   1. NodeJs can communicate to underlying file-system of the OS which the browser cannot.
   2. It can interact with the I/O devices attached to the OS which browser cannot.
   3. It can be used to spawn up the server and work on server-side stuffs which browser Javascript cannot.
   4. NodeJs can power-up desktop apps(using Electron) while browser cannot.

5. How does V8 execute JavaScript? (Explain the role of interpretation, compilation, and JIT)
   Javascript is considered an interpreted language but not anymore. Since, we're writing and executing thousands of lines of Javascript and performance is tantamount here, so it now compiled too. This trend started with Spider Monkey implementation in Firefox. Javascript is JIT compiled i.e. it is compiled on the go(when app is running) not ahead of time(AOT).

## First Node.js Script Observations

1. What is `__dirname` and `__filename`?

   **In CommonJS (require/module.exports):**
   - `__dirname`: Absolute path of the directory containing the current module file (string).
   - `__filename`: Absolute path of the current module file, with symlinks resolved (string).

   **In ES Modules (import/export):**
   - `import.meta.dirname`: Equivalent to `__dirname` (Node.js v20.11.0+, v21.2.0+)
   - `import.meta.filename`: Equivalent to `__filename` (Node.js v20.11.0+, v21.2.0+)
   - `import.meta.url`: File URL of the current module (e.g., `file:///path/to/file.mjs`)

   Example:

```javascript
// CommonJS
console.log(__dirname); // /home/user/project
console.log(__filename); // /home/user/project/app.js

// ES Modules (Node 20.11+)
console.log(import.meta.dirname); // /home/user/project
console.log(import.meta.filename); // /home/user/project/app.mjs
console.log(import.meta.url); // file:///home/user/project/app.mjs
```

**What does "symlinks resolved" mean?**

A symlink (symbolic link) is like a shortcut/alias to a file or directory.

Example:

```bash
   # Real file location:
   /home/user/projects/app/src/server.js

   # Create a symlink:
   ln -s /home/user/projects/app/src/server.js /usr/local/bin/myapp
```

If you run the symlinked file:

```bash
   node /usr/local/bin/myapp
```

`__filename` returns the REAL path, not the symlink:

```javascript
console.log(__filename);
// Output: /home/user/projects/app/src/server.js
// NOT: /usr/local/bin/myapp
```

**Why it matters:** When you do `require('./config.json')` or `import './config.json'`, Node needs to know the REAL directory to resolve relative paths correctly.

2. What is the `process` object?

   The `process` object is a global that provides information and control over the current Node.js process. It is an instance of EventEmitter.

   Key properties/methods:
   - `process.env`: Environment variables
   - `process.argv`: Command-line arguments
   - `process.cwd()`: Current working directory
   - `process.exit()`: Terminate the process
   - `process.version`: Node.js version
   - `process.platform`: Operating system platform

3. What is `global` in Node.js? How is it different from `window` in the browser?

   Both are the **global namespace objects** in their respective environments:
   - In Node.js: `global` is the top-level object. Variables declared with `var` in the global scope are NOT automatically attached to `global` (unlike browser).
   - In browser: `window` is the top-level object. Variables declared with `var` ARE attached to `window`.

   Key difference:

```javascript
// Browser:
var x = 10;
console.log(window.x); // 10

// Node.js:
var y = 20;
console.log(global.y); // undefined (NOT attached)
```

In Node.js, each file is a module with its own scope, so `var` doesn't pollute the global object.

## Module Systems: CommonJS vs. ES Modules

1. The **Module Boundary Rule** Node.js treats a file as either CommonJS (CJS) or an ES Module (ESM). They are mutually exclusive in a single file.
   - CJS Trigger: Default behavior in `.js` files, or use of `require/module.exports`.

   - ESM Trigger: Use of `import/export` keywords, `import.meta`, or setting "type": "module" in package.json.

   - The Conflict: If you use `import.meta` in a file, Node.js invalidates CJS variables like `__dirname`. Using both in one file results in a ReferenceError.

2. The "Module Wrapper" (CommonJS only) In CommonJS, Node.js does not run your code directly. It wraps your code in a hidden function:

```javascript
(function (exports, require, module, __filename, __dirname) {
  // Your code lives here
});
```

_Insight:_ This is why **dirname and **filename feel like globals but are actually local arguments injected by the wrapper. This wrapper does not exist in ES Modules.

3. What is a "Shim"? A Shim is a compatibility layer used to "fill the gap" between two different environments or versions.

Example: Since ESM doesn't have `__dirname`, we use a shim to recreate it:

```javaScript

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

4. **Isomorphic/Universal JavaScript**: As a Senior dev, use `globalThis` instead of `global` (Node) or `window` (Browser). `globalThis` is the standardized way to access the global scope in any JavaScript environment (Node, Browser, or Web Workers). Read [this in detail](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#description) to understand.

### The V8 Engine

"Node.js is built on V8" means the Javascript engine that parses, compiles, and executes your code is the **V8 engine** (the same one used in Chrome). V8 is written in C++.

**Execution Flow (JIT Compilation):**
V8 uses **Just-In-Time (JIT)** compilation.

- **Parsing:** Code is turned into an Abstract Syntax Tree (AST).
- **Interpreting:** The **Ignition** interpreter generates bytecode for fast startup.
- **Optimization:** The **TurboFan** compiler identifies "hot code" (frequently run) and compiles it into highly optimized **Machine Code**.
