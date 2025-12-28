# Callback Pattern

Before diving deeper into Node.js built-in modules, it is essential to understand the **Callback Pattern**, as it is the foundation of asynchronous programming in Node.js.

## 1. Functions as First-Class Objects

In JavaScript, functions are "first-class citizens." This means:

- They can be passed as arguments to other functions.
- They can be returned as values from other functions.
- They can be assigned to variables.

## 2. Terminology

- **Callback Function:** A function passed as an argument to another function.
- **Higher-Order Function:** A function that accepts another function as an argument or returns a function.

### Basic Example:

```javascript
function greet(name) {
  console.log(`Hello ${name}`);
}

function higherOrderFunction(callback) {
  const name = 'Vishwas';
  callback(name); // Calling the callback
}

higherOrderFunction(greet);
```

## 3. Types of Callbacks

### Synchronous Callbacks

A callback that is executed immediately during the execution of the higher-order function.

- **Example:** Array methods like `.map()`, `.filter()`, and `.sort()`.
- The logic inside the callback is applied right away to the elements of the array.

### Asynchronous (Async) Callbacks

A callback used to continue or resume code execution after an asynchronous operation has completed. These are used to delay execution until a specific time or event occurs.

- **Purpose:** Node.js uses these to prevent "blocking." Instead of waiting for a file to read or a database to respond, Node.js moves on and runs the callback once the task is done.
- **Browser Examples:**
  - `addEventListener('click', callback)`: The callback only runs when the click event happens.
  - `setTimeout(callback, delay)`: The callback runs after a specific duration.

## 4. Why Callbacks Matter in Node.js

Node.js is built around the idea of **Non-blocking I/O**. Most built-in modules (like `fs`, `http`, and `crypto`) have asynchronous versions of their methods.

### Common Async Use Cases:

1. **Reading/Writing Files:** Handling data without freezing the app.
2. **Database Queries:** Waiting for data to return from a server.
3. **Network Requests:** Handling incoming HTTP requests.

## 5. Summary Tip

While modern Node.js often uses **Promises** and **Async/Await**, the Callback pattern is still prevalent in many legacy APIs and is fundamentally how Node.js handles events under the hood. Understanding callbacks is the first step toward mastering the Node.js Event Loop.
