# FS (File System) Module

The `fs` module allows you to interact with your computer's file system (reading, writing, deleting files, etc.). Like other built-in modules, it is recommended to use the `node:` prefix.

## 1. Importing the Module

```javascript
const fs = require('node:fs'); // CommonJS
```

## 2. Reading Files

Node.js provides two ways to read files: **Synchronous** and **Asynchronous**.

### Synchronous Read (`readFileSync`)

- **Behavior:** Blocks the JavaScript main thread until the file is fully read. No other code runs during this time.
- **Usage:** Use only when the data is essential for the app to start (e.g., loading config files).
- **Return:** Returns a Buffer by default. To get a string, pass `'utf-8'` as the second argument.

```javascript
const fileContents = fs.readFileSync('./file.txt', 'utf-8');
console.log(fileContents);
```

### Asynchronous Read (`readFile`)

- **Behavior:** Non-blocking. Node.js initiates the read and moves on to the next line of code. It executes a callback once the file is ready.
- **Pattern:** Uses the **Error-First Callback** pattern (the first argument to the callback is always the error object).

```javascript
fs.readFile('./file.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});
```

## 3. Writing Files

Similar to reading, writing comes in sync and async flavors.

### `writeFileSync` vs `writeFile`

**Synchronous:**

```javascript
fs.writeFileSync('./greet.txt', 'Hello World');
```

**Asynchronous:**

```javascript
fs.writeFile('./greet.txt', 'Hello Vishwas', (err) => {
  if (err) console.log(err);
  else console.log('File written!');
});
```

### Writing Options

- **Default Behavior:** Overwrites the entire file.
- **Append Mode:** To add to the end of a file without deleting existing content, pass an options object with the `flag: "a"` property.

```javascript
fs.writeFile('./greet.txt', ' New Content', { flag: 'a' }, (err) => {
  if (err) console.log(err);
  else console.log('Content appended!');
});
```

## 4. Key Performance Insights

- **Single Threaded:** Since JavaScript is single-threaded, using `Sync` methods on a server with many users will cause the entire app to "freeze" for everyone while one person's file is being read.
- **Recommendation:** Always prefer the **Asynchronous** methods for production code to maintain high performance and responsiveness.

## 5. Pro-Tips

- **Absolute Paths:** It's safer to use `path.join(__dirname, 'file.txt')` instead of relative paths (`./file.txt`) to avoid issues when running the script from different directories.
- **Permissions:** Methods like `fs.access()` can check if a file exists or if the app has permission to read it before you try to open it.
- **Large Files:** For very large files, `fs.readFile` is still inefficient because it loads the entire file into memory at once. In those cases, you should use **Streams**.

# FS Promises Module

The `fs/promises` module is a modern, promise-based version of the File System API. It allows you to use `.then()/.catch()` or `async/await` syntax, which is generally cleaner and easier to read than the "error-first" callback pattern.

## 1. Importing the Module

You can import the promises-specific API by appending `/promises` to the module name.

```javascript
// CommonJS
const fs = require('node:fs/promises');

// ES Modules (Recommended)
import { readFile, writeFile } from 'node:fs/promises';
```

## 2. Using `.then()` and `.catch()`

This pattern is useful for handling the result of a file operation without blocking the main thread.

```javascript
fs.readFile('file.txt', 'utf-8')
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

## 3. Modern Async/Await (With Top-Level Await)

In older versions of Node.js, `await` had to be wrapped in an `async` function. However, in Node.js 22+, you can use **Top-Level Await** in both `.mjs` files and standard `.js` files (if your project is configured as a module).

### Best Practice Example (Node 22+):

Combining `import.meta.dirname` for path safety and `try/catch` for error handling:

```javascript
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

try {
  // Using absolute path resolution for reliability
  const fileContent = await readFile(
    resolve(import.meta.dirname, 'test-file.txt'),
    'utf-8',
  );
  console.log(fileContent);
} catch (error) {
  console.error('Error reading file:', error.message);
}
```

## 4. Performance vs. Readability

While the promise-based API is much cleaner, there is a specific trade-off:

- **Callback-based API:** Offers maximum performance in terms of execution time and memory allocation. Use this for extremely high-throughput applications.
- **Promise-based API:** Preferred for most modern applications due to superior readability and easier error handling.

## 5. Key Updates & Pro-Tips

- **Top-Level Await:** No more "Immediately Invoked Function Expressions" (IIFE) needed just to use `await`.
- **Path Resolution:** Always pair `fs` operations with `path.resolve` or `path.join`. Using relative paths like `./file.txt` can lead to errors if the script is executed from a different directory than where the file resides.
- **`import.meta.dirname`:** This is the modern ESM replacement for `__dirname`. It ensures your file paths are relative to the script's location, not the terminal's current working directory.

---

## Performance Deep Dive: Callbacks vs. Promises

This is a nuanced part of Node.js. **The short answer:** The callback-based API is technically faster, but for 99% of applications, the Promise-based API is the better choice.

### 1. The Performance Gap

In high-stress benchmarks, the callback API (`fs.readFile`) consistently outperforms the promises API (`fs/promises.readFile`).

**Why?**

- **Memory Overhead:** Every time you use a Promise, Node.js has to create a new Promise object in memory. If you're reading thousands of small files per second, these tiny allocations add up and put more pressure on the Garbage Collector.
- **Execution Overhead:** Promises require an extra "tick" in the microtask queue to resolve. Callbacks are executed more directly by the underlying C++ binding once the I/O is complete.

### 2. When to Use Each (The Reality Check)

#### Use `fs/promises` (The Modern Standard)

- **Default Choice:** For almost all web servers, CLI tools, and automation scripts.
- **Readability:** `async/await` prevents "Callback Hell" and makes error handling much more predictable with `try/catch`.
- **Developer Experience:** Significantly easier to maintain and debug.

#### Use Callbacks (Extreme Performance)

- **High-Throughput Systems:** If you're building a specialized tool that processes millions of files (like a custom database engine or a heavy-duty log parser).
- **Low-Level Libraries:** If you're writing a library that will be used by thousands of other developers, you might use callbacks to provide the absolute minimum overhead.

### 3. The "Sync" Trap (What to Avoid)

Regardless of whether you prefer Callbacks or Promises, **avoid `fs.readFileSync` in any server-side environment**.

- Sync methods **block the entire Event Loop**. Even if you have 100 users waiting, Node.js will stop everything until that one file is read.
- Async (Callbacks/Promises) allow Node.js to handle other requests while waiting for the hard drive to respond.

### 4. Summary Table

| API Style   | Performance | Readability | Best For...                          |
| ----------- | ----------- | ----------- | ------------------------------------ |
| Synchronous | Worst       | Simple      | Initializing configs at startup only |
| Callback    | Best        | Poor        | Extreme performance edge cases       |
| Promises    | High        | Best        | General application development      |

### Final Verdict

Stick with the **Promise-based API** using `await`. The performance cost of a Promise is measured in nanoseconds; the cost of a developer spending hours untangling nested callbacks is much higher!

**Note:** For very large files, neither callbacks nor promises are optimal—use **Streams** instead.
