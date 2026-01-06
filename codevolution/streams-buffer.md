# Character Sets and Encoding

To understand how Node.js handles data (especially in buffers and streams), you must first understand how computers represent and store information at a low level.

## 1. Binary Data

- **Computers only speak Binary:** All data (numbers, strings, images) is eventually stored as a collection of `0`s and `1`s.
- **Bit:** A single binary digit (`0` or `1`).
- **Byte:** A sequence of **8 bits**. A byte is the standard unit used to represent a single character in many encoding systems.
- **Calculation:** Computers use the Base-2 numeric system to convert binary back into decimal numbers.

## 2. Character Sets

A **Character Set** is a predefined list that maps characters (letters, symbols, emojis) to specific numbers (known as "Code Points").

- **Unicode:** The most popular character set used globally. it aims to include every character from every language in the world.
- **ASCII:** An older, smaller character set (only 128 characters), primarily for English. Unicode is backward compatible with ASCII.
- **Example:** In Unicode, the character `V` is mapped to the number `86`.

## 3. Character Encoding

**Character Encoding** defines the rules for how those "Code Points" (numbers) are converted into binary data (bits) so they can be stored in memory.

- **UTF-8:** The most common encoding for the web and Node.js.
  - It is **variable-width**: it can use 1, 2, 3, or 4 bytes to represent a character.
  - For standard English characters (like `V`), it uses exactly **1 byte** (8 bits).
- **Example Process:**
  1. **Character:** `V`
  2. **Character Set (Unicode):** Maps `V` to `86`.
  3. **Encoding (UTF-8):** Converts `86` into binary `01010110` (1 byte).

---

## 4. Key Points Not in the Video (Pro Tips)

### Why UTF-8 is Special

While the video mentions it uses 1 byte, UTF-8 is actually a **variable-length** encoding.

- Standard English letters take **1 byte**.
- Many European/Middle Eastern characters take **2 bytes**.
- Asian characters and emojis often take **3 or 4 bytes**.
- This is why the "length" of a string in bytes is not always the same as the number of characters you see on screen.

### Endianness

When dealing with multi-byte numbers in binary (like 16-bit or 32-bit integers), computers have different ways of ordering those bytes:

- **Big-Endian:** The most significant byte is stored first (at the lowest address).
- **Little-Endian:** The least significant byte is stored first.
- **Node.js Relevance:** When working with the `Buffer` module later, you will see methods like `readInt32BE` (Big-Endian) or `readInt32LE` (Little-Endian).

### Base64 Encoding

While UTF-8 is for text, you will often encounter **Base64** in Node.js.

- Base64 is used to represent binary data (like an image) as a string of ASCII characters.
- It's commonly used when you need to send binary data over a medium that only supports text (like JSON or HTML).

---

## Summary Table

| Concept           | Simple Definition                           | Example for 'A'      |
| :---------------- | :------------------------------------------ | :------------------- |
| **Character Set** | The "Dictionary" mapping chars to numbers.  | Unicode: A = 65      |
| **Encoding**      | The "Algorithm" converting numbers to bits. | UTF-8: 65 = 01000001 |
| **Binary**        | The actual 0s and 1s stored in hardware.    | `01000001`           |

# Streams and Buffers

This module explains how Node.js handles data movement and processing at a low level using Streams and Buffers.

## 1. Streams

A **Stream** is a sequence of data that is moved from one point to another over time.

- **Processing in Chunks:** The core idea in Node.js is to process data in small pieces (chunks) as they arrive, rather than waiting for the entire dataset to be available.
- **Efficiency:** This prevents unnecessary high memory usage and long wait times.
- **Real-world Example:** Watching a YouTube video. You don't wait for the entire 2GB file to download; you start watching as the first few "chunks" arrive.

## 2. Buffers

A **Buffer** is a small, physical location in memory where data is temporarily stored while it is being moved from one place to another.

- **The "Waiting Room" Analogy:** Imagine a roller coaster that holds 30 people. If 100 people arrive, 30 go on the ride, and 70 wait in the "buffer" (the queue line). If only 1 person arrives, they wait in the buffer until enough people arrive to start the ride.
- **Role in Node.js:** Node.js cannot control the speed at which data arrives. If data arrives faster than it can be processed, it sits in the buffer. If it arrives too slowly, Node waits for the buffer to fill up before sending it for processing.

---

## 3. Working with Buffers in Node.js

`Buffer` is a global object in Node.js; you do not need to `require` it.

### Creating a Buffer

```javascript
// Create a buffer from a string with UTF-8 encoding (default)
const buffer = Buffer.from('Vishwas', 'utf-8');
```

### Accessing Buffer Data

- **JSON Representation:** `buffer.toJSON()` returns an object showing the decimal Unicode values for each character.
  - Example: `V` is represented as `86`.
- **Raw Representation:** Logging the buffer directly (`console.log(buffer)`) shows the data in Hexadecimal (base-16).
  - Why Hex? Binary (0s and 1s) is too long to read easily. Hex is a more compact way to represent binary data.
- **String Representation:** `buffer.toString()` converts the binary data back into a readable string.

### Writing to a Buffer

```javascript
const buffer = Buffer.from('Vishwas');
buffer.write('Code');
console.log(buffer.toString()); // Output: "Codewas"
```

- **Fixed Size:** Buffers have a fixed memory size once created.
- **Overwriting:** If you write to a buffer, it overwrites the existing data from the start.
- **Truncation:** If the new data is longer than the buffer's capacity, the extra characters are ignored.

## 4. Pro-Tips & Missing Key Points

- **Security:** Use `Buffer.alloc(size)` to create a fresh, "zero-filled" buffer. Avoid the deprecated `new Buffer()` constructor as it can lead to security vulnerabilities (it may contain old, sensitive data from memory).
- **Buffer.allocUnsafe(size):** This is faster than `alloc` because it doesn't clear the memory first, but it should only be used if you are immediately filling it with new data.
- **Typed Arrays:** Buffers in Node.js are actually subclasses of the JavaScript `Uint8Array`. This means you can use many standard array methods on them.
- **Internal Usage:** While you might not use buffers directly every day, they are used internally by almost every I/O-related module in Node (like `fs`, `http`, and `crypto`).

## 5. Modern Buffer Creation & Best Practices

In modern Node.js, the `new Buffer()` constructor is deprecated. You should use the following static methods for better security and predictability:

### Static Creation Methods

- **`Buffer.from(data)`**: Creates a buffer from existing data (string, array, or buffer). Use this when you have the data ready.
- **`Buffer.alloc(size)`**: Creates a "clean" buffer of a specified size, pre-filled with zeros. This is the safest way to initialize a buffer.
- **`Buffer.allocUnsafe(size)`**: Creates a buffer very quickly but does **not** clear the memory. It may contain old, sensitive data from the system's memory. Only use this if you are immediately overwriting the entire buffer.

### Essential Buffer Methods

- **`buffer.length`**: Returns the size of the buffer in **bytes**, not characters. (e.g., An emoji might have a length of 4 bytes even if it's one "character").
- **`buffer.slice(start, end)`**: Returns a new buffer that references the same memory as the original, but offset and cropped by the start and end indices.
- **`buffer.copy(target)`**: Copies data from one buffer to another.
- **`Buffer.concat([buf1, buf2])`**: Merges multiple buffers into a single new buffer.

---

### ⚠️ Critical Note: Byte Length vs. String Length

Never assume `string.length` is equal to `buffer.length`.

- A string length counts **characters**.
- A buffer length counts **bytes**.

```javascript
const str = '🚀';
console.log(str.length); // 2 (UTF-16 code units)
console.log(Buffer.from(str).length); // 4 (Actual bytes in UTF-8)
```

**NOTE:** Always use `Buffer.byteLength(string)` if you need to know how much memory a string will occupy in a buffer.
