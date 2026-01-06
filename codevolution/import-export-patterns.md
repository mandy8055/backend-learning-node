# Import Export Patterns

Usually, we have five common patterns for importing and exporting modules in Node.js using CommonJS.

## 1. Single Function/Variable Export

The most basic pattern where you define a function and assign it to `module.exports` at the end of the file.

- **Export:**
  ```javascript
  const add = (a, b) => a + b;
  module.exports = add;
  ```
- **Import:**
  ```javascript
  const add = require('./math');
  ```

## 2. Direct Assignment Export

Instead of defining a variable first, you assign the function directly to `module.exports`.

- **Export:**
  ```javascript
  module.exports = (a, b) => a + b;
  ```
- **Import:**
  ```javascript
  const add = require('./math');
  ```

## 3. Object Export (Multiple Exports)

When you need to export multiple functions or variables, you wrap them in an object. This pattern often uses ES2015 shorthand properties.

- **Export:**
  ```javascript
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  module.exports = {
    add,
    subtract,
  };
  ```
- **Import Options:**
  - **Standard:** `const math = require('./math');` (Access via `math.add`)
  - **Destructured:** `const { add, subtract } = require('./math');`

## 4. Attaching to module.exports

You can attach individual properties to the `module.exports` object directly.

- **Export:**
  ```javascript
  module.exports.add = (a, b) => a + b;
  module.exports.subtract = (a, b) => a - b;
  ```
- **Import:**
  ```javascript
  const math = require('./math');
  ```

## 5. The Exports Shorthand

Node.js provides a shorthand called `exports`, which is a reference to `module.exports`.

- **Export:**
  ```javascript
  exports.add = (a, b) => a + b;
  exports.subtract = (a, b) => a - b;
  ```
- **Important Note:** While this works for attaching properties, you should generally stick to `module.exports`. Reassigning `exports` (e.g., `exports = { ... }`) breaks the reference to `module.exports` and will not export your code correctly.

---

**Summary Tip:** For consistency and to avoid bugs related to reference reassignments, **Pattern 3** (Object export) and **Pattern 4** (Attaching to module.exports) are the most robust choices for exporting multiple items.
