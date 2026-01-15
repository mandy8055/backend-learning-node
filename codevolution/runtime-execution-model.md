# Node.js Fundamentals: Runtime & Execution Model

## 1. The Node.js Runtime Architecture

Node.js is a runtime environment that enables JavaScript to execute outside the browser. It is built on three primary pillars:

- **External Dependencies:**
  - **V8 Engine:** Google’s open-source engine that compiles JavaScript into machine code.
  - **libuv:** A C library that provides the event loop and handles asynchronous I/O.
- **C++ Features:** Provides the "low-level" capabilities that JavaScript lacks, such as file system access, networking, and hardware interaction.
- **JavaScript Library:** The built-in modules (e.g., `fs`, `path`, `http`) that provide the API for developers to trigger those C++ features.

---

## 2. JavaScript Execution Characteristics

To understand Node, we must first understand the constraints of standard JavaScript:

### Synchronous & Blocking

- **Top-down Execution:** JavaScript executes one line at a time.
- **Blocking Nature:** If a task takes a long time (like a heavy loop), it blocks the execution of any code that follows. This causes the "freezing" effect often seen in poorly optimized web apps.

### Single-Threaded

- **One Call Stack:** A thread is a process used to run a task. Unlike multi-threaded languages, JavaScript has exactly **one main thread** to execute code.
- **Implication:** It can only do one thing at a time.

---

## 3. The Role of libuv

Since JavaScript is single-threaded, it cannot natively handle asynchronous operations like reading a file while simultaneously listening for network requests.

- **Delegation:** When an asynchronous method (like `fs.readFile`) is called, Node.js offloads that task to **libuv**.
- **Non-Blocking I/O:** libuv handles the task in the background (using the OS or its own thread pool) and notifies the JavaScript thread when the data is ready. This is what allows Node.js to be highly performant despite being single-threaded.

---

## 💡 Modern Additions & Technical Gaps

### The Worker Threads Module

While the main event loop is single-threaded, modern Node.js (v12+) includes the `worker_threads` module. This allows developers to create separate threads for CPU-intensive tasks, preventing the main event loop from being blocked.

### libuv Thread Pool Limits

By default, libuv uses a thread pool of **4 threads**. For highly concurrent applications involving heavy disk I/O or crypto tasks, this can be a bottleneck. It can be adjusted using:
`process.env.UV_THREADPOOL_SIZE = n;`

### V8 Engine Pipeline

The V8 engine has evolved. It now uses the **Ignition** interpreter to generate bytecode and the **TurboFan** compiler to optimize that code during execution based on profiling data.

### Top-Level Await

In older versions of Node, you had to wrap asynchronous code in an `async` function. In modern Node.js (using ES Modules), you can use `await` at the top level of your file, simplifying the syntax for initializing database connections or fetching config data.

### Understanding libuv in Node.js

## 1. What is libuv?

libuv is a multi-platform C library that provides support for asynchronous I/O based on event loops. It was originally developed for Node.js but is now used by other projects (like Julia and Neovim).

- **Language:** Written in C for maximum performance and low-level system interaction.
- **License:** Open-source and free to use.

---

## 2. Why libuv is Essential

libuv is the backbone of Node's **Asynchronous, Non-Blocking Architecture**. It solves the main problem with single-threaded JavaScript:

- It abstracts the complexity of different operating systems (Linux, macOS, Windows).
- It provides a consistent interface to perform file operations, network requests, and more without blocking the main thread.

---

## 3. How libuv Operates

While libuv is a massive library with many complex features, its functionality can be simplified into two key mechanisms for beginners:

1. **The Thread Pool:** For tasks that the OS doesn't provide a native async API for (like certain file operations or CPU-intensive crypto/hashing), libuv maintains a pool of threads to execute these in parallel.
2. **The Event Loop:** The heart of the runtime that orchestrates which tasks should be executed, when, and in what order.

---

## 💡 Modern Context & Gaps (Node v22+)

### io_uring (Linux Performance Boost)

In newer versions of Node.js (including v22), there is ongoing work to leverage `io_uring` on Linux through libuv. `io_uring` is a high-performance interface for asynchronous I/O that can be even faster than the traditional thread pool method libuv uses. While not always enabled by default, it represents the future of Node.js I/O performance.

### Beyond the Thread Pool

The video mentions the thread pool is used for file operations. It's important to know that **network I/O** (like HTTP requests) in Node.js typically does **not** use the thread pool. Instead, libuv uses native OS notification mechanisms like `epoll` (Linux), `kqueue` (macOS), or `IOCP` (Windows), making network operations extremely efficient and truly asynchronous at the OS level.

### `node:test` and `node:watch`

In Node.js v22+, there is a heavy emphasis on built-in tooling. While not strictly part of libuv, the new native **test runner** and **watch mode** (`--watch`) rely heavily on libuv’s efficient file system watching capabilities (`uv_fs_event_t`). This means you no longer need external tools like `nodemon` for many development tasks.

### Deprecation Note: `process.binding`

In older tutorials, you might see people referencing `process.binding('uv')` to access libuv internals. This is now **deprecated** and should not be used in modern Node.js development. Internal modules are now accessed differently to ensure security and stability.

## Node.js Internals: The libuv Thread Pool

## 1. What is the Thread Pool?

While the JavaScript main thread is single-threaded, **libuv** maintains a pool of threads that Node.js uses to offload time-consuming, CPU-intensive, or complex I/O tasks. This prevents the main thread from being blocked, allowing Node.js to handle other operations in the meantime.

---

## 2. How it Works: The Delegation Pattern

1. **Main Thread Encounter:** When Node.js encounters an asynchronous, time-consuming task (like reading a file or hashing a password), it doesn't execute it on the main thread.
2. **Offloading:** The task is sent to libuv.
3. **Thread Assignment:** libuv picks an available thread from its **Thread Pool** to run the task synchronously within that background thread.
4. **Completion:** Once the task is finished, the result is sent back, and the associated callback function is queued to run on the main thread.

---

## 3. Key Experiments & Inferences

### Experiment 1: Synchronous Methods (`pbkdf2Sync`)

- **Setup:** Running multiple calls of `crypto.pbkdf2Sync` (a CPU-intensive password hashing function).
- **Observation:** Each call takes roughly the same amount of time, and the total time is the **sum** of all calls (e.g., 1 call = 250ms, 3 calls = 750ms).
- **Inference:** Every method in Node.js with the `Sync` suffix runs on the **Main Thread** and is **blocking**.

### Experiment 2: Asynchronous Methods (`pbkdf2`)

- **Setup:** Running multiple calls of the asynchronous `crypto.pbkdf2`.
- **Observation:** Running 2 or 3 calls takes nearly the same time as running just 1 call.
- **Inference:** These tasks are executed in **parallel** on separate threads within the libuv thread pool. To the main thread, the operation appears asynchronous.

---

## 💡 Modern Context & Gaps (Node v22+)

### Default Thread Pool Size

By default, the libuv thread pool has **4 threads**.

- **Critical Gap:** If you run 5 asynchronous CPU-intensive tasks simultaneously, the first 4 will run in parallel, and the 5th will wait until one of the first 4 finishes. This explains why performance might suddenly "dip" when you exceed 4 concurrent heavy tasks.

### Changing the Pool Size

You can increase the number of threads (up to 1024) to handle more concurrent background tasks by setting the environment variable `UV_THREADPOOL_SIZE`.

- **Modern Tip:** In Node v22, you can set this in your `.env` file or directly in the terminal before running your script:
  `UV_THREADPOOL_SIZE=8 node index.js`

### Methods that use the Thread Pool

It is a common misconception that _all_ async tasks use the thread pool. They do not.

- **Uses Thread Pool:** `fs` (file system) modules, `crypto` (hashing/encryption), `zlib` (compression), and `dns.lookup`.
- **Does NOT use Thread Pool:** Network I/O (e.g., `http.request`, `https`, `socket`). These use native OS non-blocking mechanisms like `epoll` or `kqueue`.

### Deprecation & Security Note

While the video uses the `crypto` module, for many modern web applications, the **Web Crypto API** (`globalThis.crypto`) is now available in Node.js. It provides a more standardized way to handle cryptography across both the browser and the server. However, for heavy hashing like PBKDF2, the native `crypto` module remains the high-performance choice.
