## Modules

A module is an encapsulated and reusable chunk of code that has its own context.
In NodeJs, each file is treated as a separate module and is isolated by default.

### Types of Modules

- **Local modules:** Modules that we create in our application.
- **Built-in modules:** Modules that NodeJs ships with out of the box.
- **Third-party modules:** Modules written by other developers that we can use in our application.

### Local Modules

- It is not important to mention `.js` extension when passing it inside of `require()` function. NodeJs will append it by default.

```js
// in say add.js
const add = (a, b) => a + b;
const sum = add(1, 2);
console.log(sum);
// index.js
require('./add.js'); // can be require('./add'); also
console.log('Local module is imported above');
```

- In NodeJs, each file is a module that is isolated by default.
- To load a module into another file, we use the `require()` function.
- When a file(say `index.js`) is executed, the code in the module is also executed.
- If the file we're requiring is a Javascript file, we can **skip specifying the extension** and NodeJs will infer it on our behalf.

### `module.exports`

- When we want to expose only a specific property and keep other things private to a module, we use an object `module.exports` and assign the required property/function/object that need to be exposed.
- That exposed value **will be available as return type of `require()`** where-ever this module is imported.
- This increases the reusability of code.
- Also, in the module where it is imported the name can be anything i.e.

```js
// in say add.js
const add = (a, b) => a + b;
module.exports = add;
// index.js
const add = require('./add'); // the name can be same as the function that is declared in main file(add.js) or it can be different as well i.e. const addFn = require('./add');
console.log(add(1, 3));
console.log('Local module is imported above');
```

## Module scope

**Immediately Invoked Function Expression(IIFE) in NodeJs**

- Before a module's code is executed, NodeJs will wrap it with a function wrapper that provides module scope.
- This saves us from having to worry about conflicting variables or functions.
- There is proper encapsulation and reusability is unaffected.

## Module Wrapper

- Every module in NodeJs gets wrapped in an IIFE before being loaded.
- IIFE helps keep top level variables scoped to the module rather than the global object.
- The IIFE that wraps every module contains 5 parameters which are pretty important for the functioning of a module.

```js
(function (exports, require, module, __filename, __dirname) {
  const add = (a, b) => a + b;
})();
```

# Module Caching

## 1. Overview of Module Caching

Module caching is a core behavior in Node.js where the execution of a module is "remembered" after the first time it is loaded. This is primarily done for performance optimization to avoid re-parsing and re-executing the same code multiple times across an application.

## 2. How it Works

- **First Load:** When `require()` is called for a specific file, Node.js loads, wraps, and executes the code, then stores the result in a cache.
- **Subsequent Loads:** Any later calls to `require()` for that same file will skip the execution phase and return the cached `module.exports` object immediately.
- **Internal Mechanism:** Node.js tracks these in a global object called `require.cache`.

## 3. Caching and Object References

A critical side effect occurs when a module exports an **instance** of a class (an object):

- Because objects in JavaScript are passed by reference, every file that requires that module receives a reference to the **exact same object**.
- If File A modifies a property on that object, File B will see the modified value. This can lead to unexpected bugs if you assume you are working with a fresh state.

## 4. Patterns for Use Cases

### Scenario A: Shared State (Exporting an Instance)

Use this if you intentionally want a "Singleton" pattern where one object is shared across your entire application (e.g., a database connection pool or a configuration object).

- **Export:** `module.exports = new DatabaseConnection();`

### Scenario B: Independent Instances (Exporting a Class)

Use this if you want every consumer to have their own separate data and state. Instead of exporting the instance, you export the constructor/class itself.

- **Export:** `module.exports = SuperheroClass;`
- **Consumer Usage:** `const Hero = require('./hero'); const myHero = new Hero();`

## 5. Summary Tip

Always be mindful of _what_ you are exporting. If you export an object, be prepared for side effects caused by caching. If you need isolation, always export the class or a factory function.

## Extra notes

### Why `require()` understands the file without `.js` extension but ESM import doesn't?

It’s a great observation! This difference highlights a fundamental shift in how Node.js handles files between the older **CommonJS (CJS)** and the newer **ES Modules (ESM)**.

> **The Short Answer:** CommonJS was designed with **"magic" resolution** for developer convenience, while ES Modules were designed for **"explicit" resolution** to ensure high performance and web compatibility.

---

#### 1. CommonJS (`require`): The "Searcher"

When you use `require('./file')`, Node.js performs a series of "probes" behind the scenes. If you don't provide an extension, it tries to guess your intent by checking the file system in this order:

1.  `file.js`
2.  `file.json`
3.  `file.node` (compiled binary modules)
4.  If `./file` is a **directory**, it looks for an `index.js` inside that folder.

**Trade-off:** While convenient, this has a **performance cost** because Node.js must make multiple file system calls just to locate a single file.

---

#### 2. ES Modules (`import`): The "Web Standard"

ESM was designed to align with how browsers work. In a browser, if you fetch `/script`, the server doesn't know if you mean `.js`, `.ts`, or `.css`. You must be exact.

By requiring the `.js` extension, ESM achieves two main goals:

- **Performance:** Node.js goes straight to the exact file without "guessing" or pinging the file system multiple times.
- **Standardization:** Code written this way is more likely to work natively in a browser without needing heavy build tools like Webpack or Vite.

---

#### 3. Node.js 22+ Evolution: Automatic Detection

As of Node.js 22, the rules have become more flexible. Node can now detect the module type automatically without requiring `.mjs` or `"type": "module"` in `package.json`.

- **Detection Logic:** If Node.js encounters a file that uses `import` or `export` syntax and it doesn't have a defined type, it will attempt to treat it as an ES Module.
- **The "Extension" Catch:** Even though Node 22+ can detect that a file _is_ an ES Module, the **ESM Resolution Algorithm** still strictly requires the `.js` extension in your `import` statements to maintain web compatibility and performance.

---

#### Summary Comparison

| Feature                | CommonJS (`require`)             | ES Modules (`import`)               |
| :--------------------- | :------------------------------- | :---------------------------------- |
| **Extension**          | **Optional** (defaults to `.js`) | **Required** (must be explicit)     |
| **Directory Imports**  | Looks for `index.js`             | Not supported by default            |
| **Node 22+ Detection** | Default/Fallback                 | Detected via `import/export` syntax |
| **Philosophy**         | "Do what I mean" (Convenience)   | "Do what I say" (Predictability)    |

---

#### 💡 Pro-Tip

If you prefer the CJS style and aren't worried about browser compatibility, you can bypass the extension requirement in Node.js by using the following flag:
`node --experimental-specifier-resolution=node script.js`

_Note: This is generally discouraged. It is best practice to get used to adding extensions for future-proof code._
