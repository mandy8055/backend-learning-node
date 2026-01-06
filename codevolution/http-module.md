# Node.js HTTP Module

The built-in `http` module allows Node.js to transfer data over the HyperText Transfer Protocol (HTTP) and create web servers capable of handling asynchronous requests.

## 1. Creating a Basic Server

A server is created using `http.createServer()`. This method takes a callback function (the **Request Listener**) which executes every time a request hits the server.

```javascript
const http = require('node:http');

const server = http.createServer((req, res) => {
  // 1. Set Response Header (Status Code & Content Type)
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // 2. End the response with data
  res.end('Hello World');
});

// 3. Listen on a specific Port
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 2. Handling Different Response Types

### A. JSON Response

When building APIs, you must convert JavaScript objects to strings and set the correct `Content-Type`.

```javascript
const superhero = { firstName: 'Bruce', lastName: 'Wayne' };

res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(superhero));
```

### B. HTML Response (Static & Streaming)

For small snippets, you can send strings. For files, **Streams** are preferred for performance.

```javascript
const fs = require('node:fs');

// Streaming approach (Memory Efficient)
res.writeHead(200, { 'Content-Type': 'text/html' });
fs.createReadStream(__dirname + '/index.html').pipe(res);
```

### C. HTML Templates (Dynamic Values)

To inject dynamic data without a complex framework, you can read the file as a string and use replacement.

```javascript
let html = fs.readFileSync(__dirname + '/index.html', 'utf-8');
const name = 'Vishwas';
html = html.replace('{{name}}', name);
res.end(html);
```

## 3. HTTP Routing

You can route requests based on `req.url` (the path) and `req.method` (GET, POST, etc.).

```javascript
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Page');
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: 'Some API Data' }));
  } else {
    res.writeHead(404);
    res.end('Page Not Found');
  }
});
```

---

## 4. Modern Gaps & Node 24.x Updates

While the tutorial covers the fundamentals, the way we build servers and handle network requests has evolved significantly in the latest Node.js versions.

### Gap 1: Built-in `fetch` (Node 18+)

In older tutorials, people used `http.request` or libraries like `axios` to make outgoing requests. Node 24 now has a **stable, built-in Global `fetch` API**.

- **Recommendation:** Use `fetch()` for client-side requests instead of the complex `http.request` module.

### Gap 2: Modern Path Handling (`import.meta.dirname`)

In ESM (ECMAScript Modules), `__dirname` is not available.

- **Node 22/24 Update:** Use `import.meta.dirname` to get the current directory safely in `.mjs` files.

### Gap 3: Test Runner (`node:test`)

Testing an HTTP server used to require 3rd party tools like `supertest`. Node now has a built-in test runner.

```javascript
import test from 'node:test';
import assert from 'node:assert';

test('Server returns Hello World', async () => {
  const res = await fetch('http://localhost:3000/');
  const body = await res.text();
  assert.strictEqual(body, 'Hello World');
});
```

### Gap 4: Frameworks vs. Native HTTP

As mentioned at the end of the tutorial, native `http` is great for learning, but **Express, Fastify, or NestJS** are standard for production.

- **Gap:** The native `http` module does not handle "Body Parsing" (reading JSON sent in a POST request) easily. You have to manually collect data chunks from the request stream.

## 5. Key Summary Table

| Feature          | Code / Value                    | Why it matters                                                |
| ---------------- | ------------------------------- | ------------------------------------------------------------- |
| **Port**         | `3000`, `8080`, etc.            | The "door" your server listens on.                            |
| **Status 200**   | `res.writeHead(200)`            | Indicates success.                                            |
| **Status 404**   | `res.writeHead(404)`            | Indicates resource not found.                                 |
| **Content-Type** | `text/html`, `application/json` | Tells browser how to render data.                             |
| **Streams**      | `.pipe(res)`                    | Essential for sending large files (videos, PDFs, large HTML). |

## Pro-Tip: The "Watch" Mode

Instead of manually restarting your server (Ctrl+C), use the built-in watch mode available since Node 18+:

```bash
node --watch index.js
```

This will automatically restart your server every time you save a file.
