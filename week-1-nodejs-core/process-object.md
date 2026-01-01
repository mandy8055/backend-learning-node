# The Process Object in Node.js

The `process` object is a **global object** (no need to import) that provides information and control over the current Node.js process. It's an instance of `EventEmitter`.

---

## 1. `process.argv` - Command Line Arguments

An **array** containing command-line arguments passed when launching the Node.js process.

### Structure

```javascript
// Command: node script.js arg1 arg2 --flag=value

console.log(process.argv);
// Output:
[
  '/usr/local/bin/node', // [0] Path to Node.js executable
  '/home/user/project/script.js', // [1] Path to the script being executed
  'arg1', // [2] First user argument
  'arg2', // [3] Second user argument
  '--flag=value', // [4] Third user argument
];
```

### Key Points

- `process.argv[0]` - Path to Node executable
- `process.argv[1]` - Path to JavaScript file being executed
- `process.argv[2]` onwards - **Actual user arguments**

### Practical Usage

```javascript
// script.js
const userArgs = process.argv.slice(2); // Skip first two elements

if (userArgs.length === 0) {
  console.error('Error: Please provide a filename');
  process.exit(1); // Exit with error code
}

const filename = userArgs[0];
console.log(`Processing file: ${filename}`);
```

### Pro Tip - Argument Parsing

For complex CLI tools, use libraries like:

- `minimist` - Simple argument parsing
- `yargs` - Feature-rich CLI framework
- `commander` - Command-line interfaces

```javascript
// Using minimist (example)
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
console.log(args);
// node script.js --name=John --age=30 -v
// { _: [], name: 'John', age: 30, v: true }
```

---

## 2. Essential `process` Properties

### `process.env` - Environment Variables

```javascript
// Access environment variables
console.log(process.env.NODE_ENV); // 'development', 'production', etc.
console.log(process.env.PORT); // Custom port number
console.log(process.env.DATABASE_URL); // Database connection string

// Set in terminal:
// NODE_ENV=production node app.js
// Or use .env files with 'dotenv' package
```

**Best Practice:**

```javascript
const port = process.env.PORT || 3000; // Fallback to 3000
const isDev = process.env.NODE_ENV !== 'production';
```

---

### `process.cwd()` - Current Working Directory

```javascript
console.log(process.cwd());
// Output: /home/user/project (where you RAN the command from)

// ⚠️ IMPORTANT: This is NOT the same as __dirname!
```

**Critical Difference:**

```javascript
// Project structure:
// /home/user/project/
//   ├── app.js
//   └── src/
//       └── utils.js

// In utils.js:
console.log(__dirname); // /home/user/project/src (file location)
console.log(process.cwd()); // /home/user/project (terminal location)

// If you run: cd /home/user && node project/src/utils.js
console.log(__dirname); // /home/user/project/src (still same)
console.log(process.cwd()); // /home/user (CHANGED! Where you ran it from)
```

---

### `process.version` & `process.versions`

```javascript
console.log(process.version); // 'v22.0.0' (Node.js version)
console.log(process.versions);
// {
//   node: '22.0.0',
//   v8: '12.4.254.20',
//   uv: '1.48.0',
//   zlib: '1.3.0.1',
//   ...
// }
```

---

### `process.platform` & `process.arch`

```javascript
console.log(process.platform);
// 'darwin' (macOS), 'linux', 'win32' (Windows), 'freebsd', etc.

console.log(process.arch);
// 'x64', 'arm', 'arm64', 'ia32', etc.

// Use for platform-specific code:
const isWindows = process.platform === 'win32';
const pathSeparator = isWindows ? '\\' : '/';
```

---

### `process.pid` - Process ID

```javascript
console.log(process.pid); // 12345 (Unique process identifier)

// Useful for logging, debugging, or killing processes
```

---

## 3. Process Control Methods

### `process.exit([code])`

```javascript
// Exit immediately with status code
process.exit(0); // Success
process.exit(1); // Error

// Common pattern:
if (!userInput) {
  console.error('Error: Missing input');
  process.exit(1);
}
```

**Status Codes Convention:**

- `0` - Success
- `1` - General error
- `2` - Misuse of shell command
- `126` - Command cannot execute
- `127` - Command not found
- `130` - Script terminated by Ctrl+C

---

### `process.nextTick(callback)`

```javascript
// Executes callback AFTER the current operation completes
// But BEFORE any I/O events or timers

console.log('Start');

process.nextTick(() => {
  console.log('Next Tick');
});

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// Output:
// Start
// End
// Next Tick  ← Runs before setTimeout!
// Timeout
```

**When to use:**

- Defer execution until after current code completes
- Emit events asynchronously
- Handle errors in async constructors

---

## 4. Process Events

The `process` object emits several events:

### `exit` Event

```javascript
process.on('exit', (code) => {
  // Cleanup code here (sync only!)
  console.log(`About to exit with code: ${code}`);
});

process.exit(0);
```

### `uncaughtException` Event

```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log error, cleanup, then exit
  process.exit(1);
});

throw new Error('Oops!'); // This would normally crash the app
```

### `unhandledRejection` Event

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  // Log and decide whether to exit
});

Promise.reject('Something went wrong'); // Won't crash
```

### Signal Events (SIGINT, SIGTERM)

```javascript
// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  // Close database connections, save state, etc.
  process.exit(0);
});

// Handle kill command
process.on('SIGTERM', () => {
  console.log('SIGTERM received, cleaning up...');
  server.close(() => {
    process.exit(0);
  });
});
```

---

## 5. Standard Streams

### `process.stdin`, `process.stdout`, `process.stderr`

```javascript
// Read from stdin
process.stdin.on('data', (data) => {
  console.log(`You typed: ${data}`);
});

// Write to stdout (same as console.log)
process.stdout.write('Hello World\n');

// Write to stderr (for errors)
process.stderr.write('Error message\n');
```

---

## 6. ESM vs CJS Gotchas for `process.argv`

### ✅ Both Work Identically

```javascript
// CommonJS
console.log(process.argv);

// ES Modules
console.log(process.argv);
```

**Good news:** `process` is a **true global** and works exactly the same in both module systems!

---

## 7. Common Patterns & Best Practices

### Pattern 1: Validate Arguments

```javascript
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node script.js <input> <output>');
  process.exit(1);
}

const [inputFile, outputFile] = args;
```

### Pattern 2: Named Arguments

```javascript
// node script.js --input=file.txt --output=result.txt
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=');
  acc[key] = value;
  return acc;
}, {});

console.log(args.input); // 'file.txt'
console.log(args.output); // 'result.txt'
```

### Pattern 3: Environment-Aware Code

```javascript
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  console.log('Debug info:', process.argv);
}
```

---

## 8. ESM-Specific Notes

### ✅ Available in ESM

- `process.argv`
- `process.env`
- `process.cwd()`
- `process.exit()`
- All `process` methods and properties

### ❌ NOT Available in ESM

- `__dirname` → Use `import.meta.dirname` (Node 20.11+)
- `__filename` → Use `import.meta.filename` (Node 20.11+)
- `require` → Use `import`
- `module.exports` → Use `export`

### Replacement Pattern

```javascript
// CJS
const path = require('path');
const configPath = path.join(__dirname, 'config.json');

// ESM (Modern Node 20.11+)
import path from 'node:path';
const configPath = path.join(import.meta.dirname, 'config.json');

// ESM (Older Node versions)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

## 9. Quick Reference Table

| Property/Method      | Purpose                   | Example                          |
| -------------------- | ------------------------- | -------------------------------- |
| `process.argv`       | Command-line arguments    | `['node', 'script.js', 'arg1']`  |
| `process.env`        | Environment variables     | `process.env.PORT`               |
| `process.cwd()`      | Current working directory | `/home/user/project`             |
| `process.exit(code)` | Exit process              | `process.exit(1)`                |
| `process.platform`   | Operating system          | `'linux'`, `'darwin'`, `'win32'` |
| `process.version`    | Node.js version           | `'v22.0.0'`                      |
| `process.pid`        | Process ID                | `12345`                          |

---

## 10. Pro Tips

### Tip 1: Always Validate User Input

```javascript
const filepath = process.argv[2];

if (!filepath) {
  console.error('Error: Please provide a file path');
  console.error('Usage: node script.js <filepath>');
  process.exit(1);
}
```

### Tip 2: Use Descriptive Exit Codes

```javascript
const EXIT_CODES = {
  SUCCESS: 0,
  MISSING_ARGS: 1,
  FILE_NOT_FOUND: 2,
  INVALID_FORMAT: 3,
};

if (!fileExists(filepath)) {
  console.error(`File not found: ${filepath}`);
  process.exit(EXIT_CODES.FILE_NOT_FOUND);
}
```

### Tip 3: Combine with Path Module

```javascript
import path from 'node:path';

const filepath = process.argv[2];
const absolutePath = path.resolve(process.cwd(), filepath);
console.log(`Processing: ${absolutePath}`);
```

---

## 11. Summary

- `process` is a **global object** available everywhere in Node.js
- `process.argv` provides access to command-line arguments
- Always use `process.argv.slice(2)` to get actual user arguments
- `process.cwd()` gives terminal location, NOT file location
- Use `import.meta.dirname` in ESM instead of `__dirname`
- Always validate user input and provide helpful error messages
- Use proper exit codes to indicate success/failure
