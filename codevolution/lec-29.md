# Pipes in Node.js

A **Pipe** is a built-in method that takes a **Readable Stream** and connects it directly to a **Writable Stream**. It effectively automates the "reading and writing in chunks" process we previously did manually with event listeners.

## 1. The Concept

Think of a physical pipe connecting a water tank (Readable Source) to a sink (Writable Destination).

- You don't have to manually carry buckets of data.
- The pipe handles the flow of data automatically.

## 2. Basic Implementation

Instead of listening to the `data` event and manually calling `writableStream.write(chunk)`, you use the `.pipe()` method.

```javascript
const fs = require('node:fs');

const readableStream = fs.createReadStream('./file.txt', { encoding: 'utf-8' });
const writableStream = fs.createWriteStream('./file2.txt');

// One line replaces the entire event listener logic
readableStream.pipe(writableStream);
```

## 3. Chaining Pipes

The `.pipe()` method returns the **destination stream**, which allows you to chain multiple streams together. However, to keep chaining, the destination must be a **Duplex** or **Transform** stream.

### Example: File Compression with `zlib`

The `zlib` module provides a **Transform Stream** that can gzip data as it passes through.

```javascript
const fs = require('node:fs');
const zlib = require('node:zlib'); // Built-in compression module

const readableStream = fs.createReadStream('./file.txt');
const gzip = zlib.createGzip(); // This is a Transform stream
const writableStream = fs.createWriteStream('./file.txt.gz');

// Chaining: Readable -> Transform -> Writable
readableStream.pipe(gzip).pipe(writableStream);
```

---

## 4. Modern Gaps & Node 24.x Updates

While `.pipe()` is convenient, it has a significant flaw that has been addressed in newer versions of Node.js.

### Gap 1: Memory Leaks and Error Handling

In the `readable.pipe(writable)` pattern, if the **writable** stream fails or is closed prematurely, the **readable** stream is not automatically destroyed. This can lead to memory leaks in large applications. Additionally, `.pipe()` does not forward errors across the chain—you would have to attach an `.on('error')` to every single part of the chain.

### The Modern Standard: `stream.pipeline` (Recommended for Node 24.x)

In modern Node.js, it is a **best practice** to use `pipeline` from the `node:stream/promises` module. It automatically handles error propagation and properly destroys all streams in the chain if one fails.

```javascript
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

async function compressFile() {
  try {
    await pipeline(
      createReadStream('./file.txt'),
      createGzip(),
      createWriteStream('./file.txt.gz'),
    );
    console.log('Pipeline succeeded!');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

compressFile();
```

### Gap 2: Web Streams API

In Node.js 24, you might encounter `ReadableStream.pipeTo()` or `pipeThrough()`. These are part of the **Web Streams API**.

- Use `.pipe()` for older Node-specific streams (FS, HTTP).
- Use `pipeTo()` if you are working with modern Web Streams (often found in Fetch API or cross-platform code).

## 5. Summary Table

| Method                   | Error Handling | Reliability | Best For...                   |
| ------------------------ | -------------- | ----------- | ----------------------------- |
| **Manual `.on('data')`** | Manual         | Low         | Learning/Fine-grained control |
| **`.pipe()`**            | Manual/None    | Medium      | Simple scripts / Legacy code  |
| **`pipeline()`**         | Automatic      | **Highest** | **Production Applications**   |

## Pro-Tips

- **Never use `.pipe()` in a Production Server (HTTP):** If a user cancels a request, the file stream might stay open forever. Always use `pipeline` or `finished` from the stream module to ensure cleanup.
- **Prefix Imports:** As seen in previous notes, always use `require('node:zlib')` or `import ... from 'node:stream'` to ensure you are using built-in modules.
