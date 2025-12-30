# Streams in Node.js

A **Stream** is a sequence of data that is moved from one point to another over time. Instead of waiting for an entire file to be read into memory (which can crash your app if the file is huge), streams process data in **chunks**.

## 1. Why Use Streams?

- **Memory Efficiency:** You don't need to load large files into RAM all at once.
- **Time Efficiency:** You can start processing data as soon as the first chunk arrives, rather than waiting for the entire payload.

## 2. Types of Streams

1. **Readable:** Streams from which data can be read (e.g., `fs.createReadStream`).
2. **Writable:** Streams to which data can be written (e.g., `fs.createWriteStream`).
3. **Duplex:** Streams that are both Readable and Writable (e.g., a TCP socket).
4. **Transform:** A type of duplex stream that can modify or transform data as it is written and read (e.g., `zlib` for file compression).

## 3. Basic Implementation (FS Module)

Streams inherit from the `EventEmitter` class, meaning they emit events like `data`, `error`, and `end`.

### Reading and Writing in Chunks

```javascript
const fs = require('node:fs');

// 1. Create a readable stream
const readableStream = fs.createReadStream('./file.txt', {
  encoding: 'utf-8',
  highWaterMark: 2, // Defines chunk size in bytes (default is 64KB)
});

// 2. Create a writable stream
const writableStream = fs.createWriteStream('./file2.txt');

// 3. Listen for the 'data' event
readableStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
  writableStream.write(chunk);
});
```

---

## 4. Modern Gaps & Node 24.x Updates

The tutorial uses the "Event Listener" pattern (`.on('data')`). While this works, modern Node.js (v22+) provides much cleaner and safer ways to handle streams.

### Gap 1: Manual Backpressure

In the tutorial's code, if the `readableStream` reads data faster than the `writableStream` can write it, the data buffers in memory, potentially causing a crash. This is called **Backpressure**.

- **Old Solution:** Use `.pipe()`.
- **Modern Solution:** Use `pipeline` from `node:stream/promises`.

### Gap 2: The `pipeline` API (Recommended)

Instead of manual listeners, use the `pipeline` function. It automatically handles errors and destroys streams if one fails.

```javascript
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

async function run() {
  try {
    await pipeline(
      createReadStream('./big-file.txt'),
      createWriteStream('./destination.txt'),
    );
    console.log('Streaming finished successfully.');
  } catch (err) {
    console.error('Streaming failed:', err);
  }
}
run();
```

### Gap 3: Async Iterators (Node 22+)

Readable streams are now **Async Iterators**. You can use a `for await...of` loop to read chunks, which is much more readable than callbacks.

```javascript
import { createReadStream } from 'node:fs';

const stream = createReadStream('./file.txt', { encoding: 'utf8' });

for await (const chunk of stream) {
  console.log('New chunk arrived:', chunk);
}
```

### Gap 4: Web Streams API

Node.js 22/24 now has full support for **Web Streams** (the same API used in browsers like Chrome). If you are writing cross-platform code (Edge computing, Deno, Bun), you should look into `ReadableStream` and `WritableStream` from the global scope.

---

## 5. Summary Table: Streams vs. FS Methods

| Feature        | `fs.readFile`              | Streams (`createReadStream`)         |
| -------------- | -------------------------- | ------------------------------------ |
| **Memory**     | Loads entire file into RAM | Uses small, consistent memory chunks |
| **File Size**  | Best for small files       | Required for large files (GBs)       |
| **Processing** | Wait until 100% finished   | Process data as it arrives           |
| **Complexity** | Very Simple                | Medium                               |

## Pro-Tips

- **`highWaterMark`:** Don't set this too low (like `2` in the tutorial) in production; it causes too much overhead. The default `64KB` (or `16KB` for object mode) is usually optimal.
- **Error Handling:** Always attach an `.on('error')` listener or use the `pipeline` utility. If a stream errors and isn't handled, your Node process will crash.
