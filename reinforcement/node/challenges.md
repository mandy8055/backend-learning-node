# Node.js Learning Challenges - Level 1 & 2

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

## Evaluation Criteria

### For Code Challenges:

- ✅ Code works correctly
- ✅ Proper error handling
- ✅ Follows best practices
- ✅ Uses appropriate Node.js APIs
- ✅ Code is reusable and maintainable
- ✅ Proper use of async/await or callbacks
- ✅ Edge cases considered

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

### Exit Codes:

- `0` = Success
- `1` = General error
- `2+` = Specific error types

---

## Next Steps

After completing Level 1 & 2, you'll be ready for:

- **Level 3:** Events & EventEmitter
- **Level 4:** Buffers & Encoding
- **Level 5:** Streams
- **Level 6:** HTTP Server
- **Level 7:** Integration Challenges

---

## Self-Assessment Questions

After completing these challenges, you should be able to answer:

1. What's the difference between `exports` and `module.exports`?
2. How does the module wrapper function work?
3. When should you use synchronous vs asynchronous file operations?
4. What's the difference between `process.cwd()` and `import.meta.dirname`?
5. How do you make functions reusable vs script-like?
6. What are the performance implications of blocking operations?
7. How does `Promise.all()` improve performance?
8. When would you choose callbacks over promises?

---

## Resources

- Your notes: `lec-8-to-13.md` (Modules)
- Your notes: `lec14.md` (Import/Export Patterns)
- Your notes: `lect-16.md` (ES Modules)
- Your notes: `lec-19.md` (Path Module)
- Your notes: `lec-26-to-27.md` (File System)
- Your notes: `process-object.md` (Process Object)

---

## Revision Strategy

1. **First Pass:** Solve each challenge
2. **Second Pass:** Refactor your solutions
3. **Third Pass:** Add TypeScript types
4. **Fourth Pass:** Write tests for your solutions
5. **Fifth Pass:** Teach the concepts to someone else
