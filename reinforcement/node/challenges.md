# Node.js Learning Challenges - Complete Guide

Progressive challenges to reinforce Node.js fundamentals. Complete them in order for best results.

---

## Level 1: Fundamentals & Module System 🎯

### Challenge 1.1 (Theory)

**Question:** Explain why this code behaves differently in Node.js vs Browser:

```javascript
var myVar = 'test';
console.log(global.myVar); // Node.js
console.log(window.myVar); // Browser
```

**Key Concepts to Address:**

- Module wrapper in Node.js
- Global scope differences
- Variable attachment behavior

---

### Challenge 1.2 (Coding)

**Task:** Create a calculator module that:

- Exports `add`, `subtract`, `multiply`, `divide` functions
- Implement it TWICE: once using CommonJS, once using ES Modules
- The divide function should handle division by zero

**Requirements:**

- Use proper error handling
- Consider edge cases (invalid inputs, division by zero)
- Follow best practices for each module system

**Example Usage:**

```javascript
// CommonJS
const calc = require('./calculator');
console.log(calc.add(5, 3)); // 8
console.log(calc.divide(10, 2)); // 5
console.log(calc.divide(10, 0)); // Should throw error

// ES Modules
import { add, divide } from './calculator.js';
console.log(add(5, 3)); // 8
console.log(divide(10, 0)); // Should throw error
```

---

### Challenge 1.3 (Debugging)

**Task:** Debug and explain this CommonJS module:

```javascript
// math.js
exports = {
  add: (a, b) => a + b,
};

// index.js
const math = require('./math');
console.log(math.add(2, 3)); // Why does this fail?
```

**Your Task:**

1. Explain WHY this fails
2. Show TWO different ways to fix it
3. Explain the difference between `exports` and `module.exports`
4. When would you use each approach?

**Key Concepts:**

- Module wrapper function
- Reference vs reassignment
- How `require()` actually works
- Best practices for exports

---

## Level 2: Path & File System 📁

### Challenge 2.1 (Coding)

**Task:** Write a script that analyzes a file path string.

**Requirements:**

- Takes a file path as command-line argument (`process.argv`)
- Prints the following information:
  - Filename (with extension)
  - File extension only
  - Directory path
  - Whether it's an absolute path
- Use `path` module methods
- Validate that user provided an argument
- Use proper exit codes

**Example Usage:**

```bash
node path-analyzer.js /home/mandy/project/app.js
```

**Expected Output:**

```
Filename: app.js
Extension: .js
Directory: /home/mandy/project
Is Absolute: true
```

**Test Cases:**

```bash
# Test 1: Absolute path
node path-analyzer.js /home/user/project/index.js

# Test 2: Relative path
node path-analyzer.js src/utils/helper.ts

# Test 3: No extension
node path-analyzer.js README

# Test 4: No argument (should show error)
node path-analyzer.js
```

**Path Module Methods to Use:**

- `path.basename()`
- `path.extname()`
- `path.dirname()`
- `path.isAbsolute()`

**Important Notes:**

- This challenge requires STRING ANALYSIS only - no filesystem checks needed
- Don't over-engineer with `fs.lstat()` or similar
- Focus on `path` module capabilities

---

### Challenge 2.2 (Coding)

**Task:** Create a function `safeReadFile(filepath)` that safely reads files.

**Requirements:**

- Reads a file **asynchronously** using `fs/promises`
- Uses `path.resolve()` with `import.meta.dirname` for path safety
- RETURNS the content (don't use `console.log` or `process.exit`)
- Returns a custom error message if file doesn't exist
- Handles errors gracefully with try-catch
- Should be a reusable function (not a script)

**Function Signature:**

```javascript
async function safeReadFile(filepath: string): Promise<string>
```

**Example Usage:**

```javascript
// File exists
const content = await safeReadFile('test-file.txt');
console.log(content); // File contents

// File doesn't exist
const error = await safeReadFile('nonexistent.txt');
console.log(error); // "Error: File 'nonexistent.txt' not found"

// Multiple files (should work without crashing)
const files = ['file1.txt', 'file2.txt', 'missing.txt'];
for (const file of files) {
  const result = await safeReadFile(file);
  console.log(result);
}
```

**Key Design Principles:**

- Function should RETURN data, never call `process.exit()`
- Use `import.meta.dirname` for path resolution
- Handle specific error codes (ENOENT, EACCES)
- Make it reusable - can be called multiple times without side effects

**Error Codes to Handle:**

- `ENOENT` - File not found
- `EACCES` - Permission denied
- Generic errors - Other failures

---

### Challenge 2.3 (Theory)

**Scenario:** Your colleague writes this code in a web server handling 1000 concurrent users:

```javascript
const fs = require('fs');

app.get('/api/data', (req, res) => {
  const data = fs.readFileSync('data.txt', 'utf-8');
  const users = fs.readFileSync('users.txt', 'utf-8');
  const config = fs.readFileSync('config.txt', 'utf-8');

  res.json({ data, users, config });
});
```

**Questions:**

1. What's wrong with this approach?
2. What happens to the other 999 users while one user's request is being processed?
3. How would you fix it? (Show code)
4. What's the difference between using callbacks vs promises for the fix?
5. How could you make it even faster? (Bonus)

**Key Concepts to Demonstrate:**

- Understanding of blocking vs non-blocking I/O
- Event loop behavior
- Synchronous vs asynchronous operations
- Performance implications in production servers
- Callback vs Promise performance trade-offs

**Bonus Points:**

- Explain `Promise.all()` for parallel operations
- Discuss when to use `readFileSync` (if ever)
- Error handling strategies

---

## Level 3: Events & EventEmitter 🎪

### Challenge 3.1 (Coding)

**Task:** Create a `TaskManager` class that manages tasks using events.

**Requirements:**

- Extends `EventEmitter`
- Has `addTask(taskName)` method that emits a 'taskAdded' event
- Has `completeTask(taskName)` method that emits a 'taskCompleted' event
- Tracks actual pending tasks (not just count)
- Has `getPendingCount()` method that returns number of pending tasks
- Has `getPendingTasks()` method that returns array of task names
- Validates input (task name must be non-empty string)
- Handles edge cases (completing non-existent tasks, duplicate tasks)
- Prevents completing the same task twice
- Uses `Set` for task storage (automatic duplicate prevention)

**Function Signatures:**

```javascript
class TaskManager extends EventEmitter {
  addTask(taskName: string): void
  completeTask(taskName: string): boolean
  getPendingCount(): number
  getPendingTasks(): string[]
  hasTask(taskName: string): boolean
}
```

**Example Usage:**

```javascript
import TaskManager from './task-manager.js';

const manager = new TaskManager();

manager.on('taskAdded', (taskName) => {
  console.log(`✅ New task: ${taskName}`);
});

manager.on('taskCompleted', (taskName) => {
  console.log(`🎉 Completed: ${taskName}`);
});

manager.addTask('Write code');
manager.addTask('Review PR');
manager.addTask('Deploy app');

manager.completeTask('Write code');
manager.completeTask('Review PR');

console.log(`Pending tasks: ${manager.getPendingCount()}`); // 1
console.log('Tasks:', manager.getPendingTasks()); // ['Deploy app']
```

**Expected Output:**

```
✅ New task: Write code
✅ New task: Review PR
✅ New task: Deploy app
🎉 Completed: Write code
🎉 Completed: Review PR
Pending tasks: 1
Tasks: ['Deploy app']
```

**Edge Cases to Handle:**

1. Completing a task that doesn't exist
2. Adding empty or non-string task names
3. Preventing duplicate task additions
4. Preventing negative task counts

**Key Design Principles:**

- Use `Set` for automatic duplicate prevention and O(1) lookups
- Encapsulation - don't expose internal `Set` directly
- Validation - check inputs before processing
- Return values - `completeTask()` should return boolean (success/failure)
- Don't use direct property access from outside the class

---

### Challenge 3.2 (Coding)

**Task:** Build a decoupled pub-sub system with three independent classes.

**Requirements:**

Create THREE separate classes:

1. **`PizzaShop`** (extends EventEmitter)

   - Has `order(size, topping)` method
   - Emits 'order' event with size and topping
   - Tracks order number internally

2. **`DrinkMachine`** (extends EventEmitter)

   - Listens to pizza orders
   - Automatically selects drink based on pizza size
   - Emits 'drinkServed' event

3. **`DeliveryService`** (extends EventEmitter)
   - Listens to pizza orders
   - Schedules delivery
   - Emits 'deliveryScheduled' event

**Critical Requirement:** The classes should NOT know about each other! They only know about events.

**Example Usage:**

```javascript
import PizzaShop from './pizza-shop.js';
import DrinkMachine from './drink-machine.js';
import DeliveryService from './delivery-service.js';

// Create instances
const pizzaShop = new PizzaShop();
const drinkMachine = new DrinkMachine();
const deliveryService = new DeliveryService();

// Wire them up (ONLY in main file, not in classes)
pizzaShop.on('order', (size, topping) => {
  drinkMachine.serveDrink(size);
  deliveryService.scheduleDelivery(size, topping);
});

drinkMachine.on('drinkServed', (drink) => {
  console.log(`Drink: ${drink}`);
});

deliveryService.on('deliveryScheduled', (time) => {
  console.log(`Delivery at: ${time}`);
});

// Place orders
pizzaShop.order('large', 'pepperoni');
pizzaShop.order('medium', 'veggie');
```

**Expected Output:**

```
Order #1: large pepperoni pizza
Drink: Large Coke
Delivery at: 6:30 PM

Order #2: medium veggie pizza
Drink: Medium Sprite
Delivery at: 6:45 PM
```

**Key Concepts:**

- Event-driven architecture
- Loose coupling between modules
- Each class is self-contained
- Communication only through events
- No direct dependencies between PizzaShop, DrinkMachine, and DeliveryService

**Why This Matters:**

- You could remove DeliveryService entirely without breaking PizzaShop
- You could add a new "LoyaltyProgram" class that listens to orders
- Each module can be tested independently
- Real-world pattern used in large applications

---

### Challenge 3.3 (Theory)

**Question:** What's wrong with this code?

```javascript
import { EventEmitter } from 'node:events';

class DataProcessor extends EventEmitter {
  constructor() {
    // Missing something critical!
    this.data = [];
  }

  process(item) {
    this.data.push(item);
    this.emit('itemProcessed', item);
  }
}

const processor = new DataProcessor();
processor.on('itemProcessed', (item) => {
  console.log('Processed:', item);
});

processor.process('Hello'); // What happens?
```

**Your Task:**

1. Identify what's missing in the constructor
2. Explain WHY it's needed
3. What error will occur if you try to use this code?
4. Show the corrected version
5. Explain what `super()` actually does

**Key Concepts:**

- Class inheritance in JavaScript
- EventEmitter initialization
- The role of `super()` in constructors
- What happens if `super()` is missing
- Constructor execution order

**Bonus:**

- Explain when you can access `this` in a child class constructor
- What would happen if you called `this.emit()` before `super()`?

---

## Level 4: Buffers & Encoding 🔤

### Challenge 4.1 (Theory)

**Question:** Explain the output of this code:

```javascript
const str = 'Hello';
const buf = Buffer.from(str);

console.log(buf); // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString()); // "Hello"
console.log(buf.length); // 5

const emoji = '🚀';
const emojiBuf = Buffer.from(emoji);
console.log(emoji.length); // 2
console.log(emojiBuf.length); // 4
```

**Your Task:**

1. Why does the buffer show hexadecimal values (48 65 6c 6c 6f)?
2. What does `48` represent? Convert it to character.
3. Why is `emoji.length` (2) different from `emojiBuf.length` (4)?
4. Explain the difference between UTF-8 and UTF-16
5. What is a "code point" vs a "code unit"?

**Key Concepts:**

- Character sets (Unicode, ASCII)
- Character encoding (UTF-8, UTF-16)
- Binary representation
- Hexadecimal notation
- String length vs byte length

---

### Challenge 4.2 (Coding)

**Task:** Write a function `getByteSize(str)` that returns accurate byte size.

**Requirements:**

- Returns the ACTUAL byte size of a string in UTF-8
- Should not use `.length` property directly
- Must handle multi-byte characters correctly (emojis, Chinese characters)
- Include test cases for different character types

**Function Signature:**

```javascript
function getByteSize(str: string): number
```

**Example Usage:**

```javascript
console.log(getByteSize('Hello')); // 5 (1 byte each)
console.log(getByteSize('Hello 🚀')); // 10 (5 + 1 space + 4 for emoji)
console.log(getByteSize('你好')); // 6 (3 bytes each for Chinese)
console.log(getByteSize('café')); // 5 ('é' is 2 bytes)
```

**Test Cases:**

```javascript
// ASCII characters (1 byte each)
getByteSize('ABC'); // 3

// Mixed ASCII and multi-byte
getByteSize('Hello 世界'); // 11 (5 + 1 + 6)

// Only emojis
getByteSize('👋🌍'); // 8 (4 bytes each)

// Empty string
getByteSize(''); // 0
```

**Bonus:**

- Explain WHY `"🚀".length === 2` in JavaScript
- How would you count actual characters (not code units)?

---

### Challenge 4.3 (Coding)

**Task:** Create functions to convert files to/from Base64.

**Requirements:**

- `fileToBase64(filepath)` - Reads file and returns Base64 string
- `base64ToFile(base64String, outputPath)` - Converts Base64 back to file
- Both functions should be asynchronous
- Handle errors gracefully
- Use `fs/promises` for file operations

**Function Signatures:**

```javascript
async function fileToBase64(filepath: string): Promise<string>
async function base64ToFile(base64String: string, outputPath: string): Promise<void>
```

**Example Usage:**

```javascript
// Encode image to Base64
const base64 = await fileToBase64('image.png');
console.log(base64.substring(0, 50)); // First 50 chars

// Decode Base64 back to file
await base64ToFile(base64, 'image-copy.png');
console.log('File restored successfully!');
```

**Use Cases:**

- Embedding images in HTML/CSS
- Storing binary data in JSON
- Transferring files over text-based protocols

**Key Concepts:**

- Buffer to Base64 conversion
- Base64 to Buffer conversion
- When to use Base64 encoding
- File I/O with buffers

---

## Level 5: Streams 🌊

### Challenge 5.1 (Coding)

**Task:** Create a line counter that uses streams to count lines in a file.

**Requirements:**

- Uses `createReadStream` (not `readFile`)
- Processes file in chunks (memory efficient)
- Counts total number of lines
- Shows progress every 1000 lines
- Works with large files (100MB+)
- Doesn't load entire file into memory

**Example Usage:**

```javascript
const count = await countLines('large-file.log');
console.log(`Total lines: ${count}`);

// During execution:
// Progress: 1000 lines processed
// Progress: 2000 lines processed
// ...
// Total lines: 45823
```

**Expected Behavior:**

```javascript
// For a file with content:
// Line 1
// Line 2
// Line 3

countLines('test.txt'); // Returns: 3
```

**Key Concepts:**

- Stream-based processing
- Memory efficiency
- Chunk processing
- Event listeners (data, end, error)

---

### Challenge 5.2 (Coding)

**Task:** Build a file duplicator using streams.

**Requirements:**

- Uses `createReadStream` and `createWriteStream`
- Copies file chunk by chunk (don't load entire file)
- Uses modern `pipeline` from `node:stream/promises`
- Handles errors properly
- Shows copy progress (optional)
- Works with any file type (text, images, videos)

**Function Signature:**

```javascript
async function copyFile(source: string, destination: string): Promise<void>
```

**Example Usage:**

```javascript
await copyFile('large-video.mp4', 'large-video-copy.mp4');
console.log('File copied successfully!');

// Should handle errors:
try {
  await copyFile('nonexistent.txt', 'output.txt');
} catch (error) {
  console.error('Copy failed:', error.message);
}
```

**Why Not Use `fs.copyFile()`?**

This challenge teaches:

- How streams work under the hood
- Memory-efficient file processing
- Error handling in pipelines
- Understanding of backpressure

---

### Challenge 5.3 (Coding)

**Task:** Create a log file compressor using streams and zlib.

**Requirements:**

- Reads a `.log` file as a stream
- Compresses it using `zlib.createGzip()`
- Writes to `.log.gz` file
- Uses `pipeline` for proper error handling
- Reports compression ratio

**Function Signature:**

```javascript
async function compressLogFile(inputPath: string): Promise<void>
```

**Example Usage:**

```javascript
await compressLogFile('app.log');

// Output:
// Compressing app.log...
// Original size: 10.5 MB
// Compressed size: 2.1 MB
// Compression ratio: 80%
// Saved to: app.log.gz
```

**Bonus:**

- Add a decompression function
- Support multiple compression formats (gzip, deflate, brotli)
- Add progress indicator for large files

**Real-World Use Cases:**

- Log rotation and archival
- Backup systems
- File transfer optimization

---

## Level 6: HTTP Server 🌐

### Challenge 6.1 (Coding)

**Task:** Create a basic HTTP server with multiple routes.

**Requirements:**

- Responds to `/` with "Welcome to my API!"
- Responds to `/api/time` with current time as JSON
- Responds to `/api/user` with a JSON object `{name: "Your Name", role: "Developer"}`
- Responds to `/health` with `{status: "ok"}`
- Returns 404 for unknown routes
- Use proper HTTP status codes
- Set correct `Content-Type` headers

**Example Server:**

```javascript
// server.js
import { createServer } from 'node:http';

const PORT = 3000;

const server = createServer((req, res) => {
  // Your code here
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Expected Responses:**

```bash
# Test 1: Root route
curl http://localhost:3000/
# Response: Welcome to my API!

# Test 2: Time API
curl http://localhost:3000/api/time
# Response: {"time":"2025-01-07T10:30:00.000Z"}

# Test 3: User API
curl http://localhost:3000/api/user
# Response: {"name":"Mandy","role":"Developer"}

# Test 4: Health check
curl http://localhost:3000/health
# Response: {"status":"ok"}

# Test 5: 404
curl http://localhost:3000/unknown
# Response: 404 Not Found
```

**Key Concepts:**

- HTTP methods and status codes
- Content-Type headers
- JSON serialization
- URL routing

---

### Challenge 6.2 (Coding)

**Task:** Build a static file server that serves HTML files using streams.

**Requirements:**

- Serves files from a `public/` directory
- Uses streams (not `readFileSync`)
- Sets proper `Content-Type` based on file extension
- Returns 404 for missing files
- Returns 403 for files outside `public/` directory (security!)
- Handles errors gracefully

**Directory Structure:**

```
project/
├── server.js
└── public/
    ├── index.html
    ├── about.html
    └── styles.css
```

**Example Usage:**

```bash
# Start server
node server.js

# Access files
curl http://localhost:3000/index.html
curl http://localhost:3000/about.html
curl http://localhost:3000/styles.css

# Should return 404
curl http://localhost:3000/nonexistent.html
```

**Security Consideration:**

```javascript
// DANGEROUS - Don't allow this!
curl http://localhost:3000/../server.js
// Should return 403 Forbidden, not serve the file!
```

**Content-Type Mapping:**

```javascript
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};
```

**Key Concepts:**

- Stream-based file serving
- Path security (prevent directory traversal)
- MIME types
- Error handling in HTTP servers

---

### Challenge 6.3 (Advanced)

**Task:** Create an API server with POST request handling.

**Requirements:**

- GET `/api/users` - Returns array of users
- POST `/api/users` - Adds a new user (reads request body!)
- GET `/api/users/:id` - Returns specific user
- DELETE `/api/users/:id` - Deletes user
- Stores users in memory (array)
- Parses JSON request bodies
- Returns proper HTTP status codes (200, 201, 404, 400, 500)
- Validates user data

**Data Structure:**

```javascript
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
```

**Example Requests:**

```bash
# GET all users
curl http://localhost:3000/api/users
# Response: [{"id":1,"name":"Alice","email":"alice@example.com"},...]

# POST new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com"}'
# Response: {"id":3,"name":"Charlie","email":"charlie@example.com"}
# Status: 201 Created

# GET specific user
curl http://localhost:3000/api/users/1
# Response: {"id":1,"name":"Alice","email":"alice@example.com"}

# DELETE user
curl -X DELETE http://localhost:3000/api/users/2
# Response: {"message":"User deleted"}

# Invalid data
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":""}'
# Response: {"error":"Name and email are required"}
# Status: 400 Bad Request
```

**Key Challenges:**

- Reading POST body (it comes in chunks!)
- Parsing JSON safely
- Implementing basic routing (without framework)
- Input validation
- HTTP status codes

**Reading Request Body Pattern:**

```javascript
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}
```

---

## Level 7: Integration Challenges 🚀

### Challenge 7.1 (Advanced Integration)

**Task:** Build a "File Watcher" utility that monitors a directory.

**Requirements:**

- Watches a directory for new `.txt` files
- When a file is created, reads it with streams
- Emits an event with file content
- Logs all activities to `watcher.log` file
- Compresses old log files (> 1MB)
- Uses EventEmitter for notifications
- Graceful shutdown on SIGINT (Ctrl+C)

**Architecture:**

```javascript
class FileWatcher extends EventEmitter {
  constructor(watchDir, logFile) {
    super();
    this.watchDir = watchDir;
    this.logFile = logFile;
  }

  start() {
    // Watch directory
    // Emit 'fileDetected' event
  }

  stop() {
    // Cleanup and close watchers
  }
}
```

**Example Usage:**

```javascript
const watcher = new FileWatcher('./watched', './watcher.log');

watcher.on('fileDetected', (filename, content) => {
  console.log(`New file: ${filename}`);
  console.log(`Content: ${content.substring(0, 50)}...`);
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});

watcher.start();

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  watcher.stop();
  process.exit(0);
});
```

**Features to Implement:**

1. File system watching (fs.watch or fs.watchFile)
2. Stream-based file reading
3. Event emission
4. Logging with rotation
5. Graceful shutdown

---

### Challenge 7.2 (CLI Tool)

**Task:** Create a CLI tool to download and save web pages.

**Requirements:**

- Takes URL as command-line argument
- Fetches HTML content using `http` or `https` module
- Saves to file using streams
- Shows progress (bytes downloaded)
- Uses events for progress updates
- Handles redirects
- Validates URL format
- Proper error handling

**Example Usage:**

```bash
node fetch-page.js https://example.com

# Output:
# Fetching: https://example.com
# Progress: 1024 bytes
# Progress: 2048 bytes
# ...
# Downloaded: 5432 bytes
# Saved to: example.com.html
```

**Advanced Features:**

```bash
# Custom output filename
node fetch-page.js https://example.com -o mypage.html

# Multiple URLs
node fetch-page.js url1.com url2.com url3.com

# Quiet mode (no progress)
node fetch-page.js https://example.com --quiet
```

**Concepts Used:**

- HTTP/HTTPS requests
- Stream piping
- Progress tracking
- CLI argument parsing
- File I/O
- Error handling

---

### Challenge 7.3 (Mini Framework)

**Task:** Build a mini Express-like framework.

**Requirements:**

Create a `MiniExpress` class that:

- Manages routes (GET, POST, PUT, DELETE)
- Supports middleware pattern
- Handles request/response
- Provides helper methods (res.json, res.status)
- Supports route parameters (/users/:id)
- Error handling middleware

**API Design:**

```javascript
import MiniExpress from './mini-express.js';

const app = new MiniExpress();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.post('/users', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

// Error handling
app.use((error, req, res) => {
  res.status(500).json({ error: error.message });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Core Features:**

1. Route registration (get, post, put, delete)
2. Middleware chain execution
3. Request/response helpers
4. Route parameter parsing
5. Error handling

**Implementation Hints:**

```javascript
class MiniExpress {
  constructor() {
    this.routes = { GET: [], POST: [], PUT: [], DELETE: [] };
    this.middlewares = [];
  }

  get(path, handler) {
    this.routes.GET.push({ path, handler });
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(port, callback) {
    const server = createServer((req, res) => {
      // Execute middleware chain
      // Match route
      // Call handler
    });

    server.listen(port, callback);
  }
}
```

---

## Evaluation Criteria

### For Code Challenges:

- ✅ Code works correctly
- ✅ Proper error handling
- ✅ Follows best practices
- ✅ Uses appropriate Node.js APIs
- ✅ Code is reusable and maintainable
- ✅ Proper use of async/await or callbacks
- ✅ Edge cases considered
- ✅ Events are used correctly (Level 3+)
- ✅ Proper class inheritance (Level 3+)
- ✅ Memory-efficient streaming (Level 5+)
- ✅ Proper HTTP handling (Level 6+)

### For Theory Challenges:

- ✅ Demonstrates understanding of core concepts
- ✅ Can explain "why" not just "what"
- ✅ Relates to real-world scenarios
- ✅ Identifies performance implications
- ✅ Suggests practical solutions

---

## Common Mistakes to Avoid

### Level 1:

- ❌ Using `exports = {}` instead of `module.exports = {}`
- ❌ Assuming `var` works the same in Node.js and browser
- ❌ Not understanding the module wrapper function

### Level 2:

- ❌ Using `readFileSync` in server code
- ❌ Forgetting to validate `process.argv` input
- ❌ Not using `import.meta.dirname` for path resolution
- ❌ Making functions exit the process instead of returning values
- ❌ Over-engineering simple string analysis (Challenge 2.1)
- ❌ Using wrong exit codes (0 for errors)

### Level 3:

- ❌ Forgetting to call `super()` in EventEmitter subclass
- ❌ Tracking count instead of actual tasks (Challenge 3.1)
- ❌ Exposing internal state directly (breaking encapsulation)
- ❌ Not handling edge cases (duplicate completions, non-existent tasks)
- ❌ Creating tight coupling between event-emitting classes (Challenge 3.2)
- ❌ Not validating input before emitting events

### Level 4:

- ❌ Confusing string length with byte length
- ❌ Not understanding UTF-8 vs UTF-16 encoding
- ❌ Using `.length` for multi-byte characters
- ❌ Not handling Buffer creation safely
- ❌ Forgetting that emojis are 4 bytes in UTF-8

### Level 5:

- ❌ Loading entire file into memory with `readFile` instead of streaming
- ❌ Not using `pipeline` for proper error handling
- ❌ Forgetting to handle stream errors
- ❌ Not considering backpressure in custom streams
- ❌ Using deprecated `.pipe()` without proper cleanup

### Level 6:

- ❌ Using wrong HTTP status codes
- ❌ Not setting `Content-Type` headers
- ❌ Reading request body synchronously
- ❌ Not validating user input
- ❌ Allowing directory traversal attacks
- ❌ Not handling request errors

### Level 7:

- ❌ Not cleaning up resources on shutdown
- ❌ Mixing concerns (routing, business logic, data access)
- ❌ Not handling SIGINT/SIGTERM signals
- ❌ Memory leaks from unclosed streams/watchers
- ❌ Not using proper error boundaries

---

## Pro Tips

### For All Challenges:

1. **Read requirements carefully** - Don't add unnecessary complexity
2. **Test edge cases** - What happens with invalid input?
3. **Use TypeScript** - Since you prefer it, implement in TS
4. **Follow ESM patterns** - You'll use this in production
5. **Make it reusable** - Functions should return, not exit

### For Path/FS Challenges:

- Always use `node:` prefix for built-in modules
- Combine `process.argv` validation with `path` operations
- Remember: `process.cwd()` ≠ `import.meta.dirname`
- Use `path.resolve()` for absolute paths
- Handle errors with specific error codes

### For EventEmitter Challenges:

- Always call `super()` first in constructor
- Use `Set` for unique collections (automatic duplicate handling)
- Don't expose internal data structures directly
- Events should be verbs (past tense): 'taskAdded', 'orderPlaced'
- Keep classes decoupled - communicate only through events
- Return meaningful values from methods (e.g., boolean for success/failure)

### For Buffer/Encoding Challenges:

- Use `Buffer.byteLength()` for accurate byte size
- Remember: String length ≠ Buffer length
- Use `Buffer.alloc()` (safe) not `new Buffer()` (deprecated)
- Understand UTF-8 vs UTF-16 encoding
- Test with emojis and multi-byte characters

### For Streams Challenges:

- Always use `pipeline` from `node:stream/promises`
- Handle all three stream events: data, end, error
- Don't load large files into memory
- Use `highWaterMark` carefully (default 64KB is usually good)
- Remember: streams are async, plan accordingly

### For HTTP Challenges:

- Request body comes in chunks - collect them properly
- Always validate and sanitize user input
- Use proper HTTP status codes (200, 201, 400, 404, 500)
- Set correct Content-Type headers
- Handle errors gracefully (don't crash the server!)
- Use `--watch` flag: `node --watch server.js`

### Exit Codes:

- `0` = Success
- `1` = General error
- `2+` = Specific error types

---

## Self-Assessment Questions

After completing all challenges, you should be able to answer:

### Level 1 & 2:

1. What's the difference between `exports` and `module.exports`?
2. How does the module wrapper function work?
3. When should you use synchronous vs asynchronous file operations?
4. What's the difference between `process.cwd()` and `import.meta.dirname`?
5. How do you make functions reusable vs script-like?
6. What are the performance implications of blocking operations?
7. How does `Promise.all()` improve performance?
8. When would you choose callbacks over promises?

### Level 3:

9. Why must you call `super()` in EventEmitter subclasses?
10. What's the difference between tracking count vs tracking actual items?
11. How do you create decoupled, event-driven architecture?
12. When should you use `Set` vs `Array`?
13. What makes a function reusable vs tightly coupled?
14. How do you validate inputs in class methods?
15. What's the difference between encapsulated state vs exposed properties?

### Level 4:

16. What's the difference between a character set and character encoding?
17. Why is string.length different from Buffer.byteLength(string)?
18. What's the difference between UTF-8 and UTF-16?
19. When should you use Base64 encoding?
20. What's a code point vs a code unit?

### Level 5:

21. What's the difference between `readFile` and `createReadStream`?
22. When should you use streams vs loading entire files?
23. What is backpressure and why does it matter?
24. Why is `pipeline` better than `.pipe()`?
25. How do streams improve memory efficiency?

### Level 6:

26. What are the common HTTP status codes and when to use them?
27. How do you read POST request body in raw Node.js?
28. What's the difference between GET and POST?
29. Why should you never allow directory traversal in file servers?
30. What's a MIME type / Content-Type?

### Level 7:

31. How do you handle graceful shutdown in Node.js?
32. What's the middleware pattern?
33. How does Express.js routing work under the hood?
34. Why are event-driven architectures useful for I/O operations?
35. What are the key considerations for building production-ready Node.js apps?

---

## Resources

### Level 1 & 2:

- Your notes: `lec-8-to-13.md` (Modules)
- Your notes: `lec14.md` (Import/Export Patterns)
- Your notes: `lect-16.md` (ES Modules)
- Your notes: `lec-19.md` (Path Module)
- Your notes: `lec-26-to-27.md` (File System)
- Your notes: `process-object.md` (Process Object)

### Level 3:

- Your notes: `lec-20.md` (Callback Pattern)
- Your notes: `lec-21-to-22.md` (Events Module & EventEmitter)

### Level 4:

- Your notes: `lec-23-to-24.md` (Character Sets, Encoding, Buffers)

### Level 5:

- Your notes: `lec-28.md` (Streams)
- Your notes: `lec-29.md` (Pipes)

### Level 6:

- Your notes: `lec-30-to-36.md` (HTTP Module)

---

## Revision Strategy

1. **First Pass:** Solve each challenge (Focus: Getting it to work)
2. **Second Pass:** Refactor your solutions (Focus: Best practices)
3. **Third Pass:** Add TypeScript types (Focus: Type safety)
4. **Fourth Pass:** Write tests for your solutions (Focus: Reliability)
5. **Fifth Pass:** Teach the concepts to someone else (Focus: Deep understanding)

---

## Final Projects (After Completing All Levels)

Once you've mastered all challenges, build these real-world projects:

### Project 1: CLI Task Manager

- Store tasks in JSON file
- Add, list, complete, delete tasks
- Color-coded output
- Due dates and priorities
- Export to CSV

### Project 2: File Upload Server

- Accept file uploads via POST
- Save to disk with unique filenames
- Serve uploaded files
- List all uploads
- Delete uploads

### Project 3: Log Aggregator

- Watch multiple log directories
- Aggregate logs from multiple sources
- Search and filter logs
- Compress old logs
- Web interface to view logs

### Project 4: Simple Proxy Server

- Forward requests to target server
- Log all requests/responses
- Modify headers
- Rate limiting
- Caching

---

## Bonus: Performance Optimization

After completing all challenges, revisit and optimize:

1. **Profile your code** - Use Node.js built-in profiler
2. **Benchmark** - Compare different approaches
3. **Memory usage** - Check for leaks
4. **Async optimization** - Parallel vs sequential
5. **Caching** - When and where to cache

---

**Good luck on your Node.js journey! 🚀**

**Remember:** The goal isn't just to complete challenges, but to **understand deeply** how Node.js works under the hood. Take your time, experiment, break things, and learn!
