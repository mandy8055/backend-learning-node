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
- **Blocking Nature:** If a task takes a long time (like a heavy loop), it blocks the execution of any code that follows. This causes the "freezing" effect often seen in web apps.

### Single-Threaded

- **One Call Stack:** A thread is a process used to run a task. JavaScript has exactly **one main thread** to execute code.
- **Implication:** It can only do one thing at a time.

---

## 3. The Role of libuv

libuv is a multi-platform C library that provides support for asynchronous I/O. It is the backbone of Node's **Asynchronous, Non-Blocking Architecture**.

- **Delegation:** When an async method (like `fs.readFile`) is called, Node.js offloads that task to libuv.
- **Abstraction:** libuv handles the complexity of different operating systems (Linux, macOS, Windows) and provides a consistent interface.
- **Core Mechanisms:** It operates using two main features: the **Thread Pool** and the **Event Loop**.

---

## 4. Deep Dive: The libuv Thread Pool

While the JS main thread is single-threaded, libuv maintains a pool of threads to offload time-consuming or CPU-intensive tasks.

### The Delegation Pattern

1. **Main Thread Encounter:** Encountering an async task (hashing, file I/O).
2. **Offloading:** Task sent to libuv.
3. **Thread Assignment:** libuv picks an available thread from its pool to run the task synchronously in the background.
4. **Completion:** Result is sent back; the callback is queued for the main thread.

### Key Experiments & Inferences

#### Experiment 1: Synchronous Methods (`pbkdf2Sync`)

- **Observation:** Running 3 calls takes 3x the time of 1 call (Sequential).
- **Inference:** Every method with the `Sync` suffix runs on the **Main Thread** and is **blocking**.

#### Experiment 2: Asynchronous Methods (`pbkdf2`)

- **Observation:** Running 3 calls takes nearly the same time as 1 call (Parallel).
- **Inference:** These run in parallel on separate threads in the libuv thread pool.

#### Experiment 3: Default Thread Pool Size

- **Observation:** Running 5 async calls results in the first 4 finishing together, and the 5th taking twice as long.
- **Inference:** The default libuv thread pool size is **4 threads**. The 5th task must wait for a free thread.

#### Experiment 4: Increasing Pool Size

- **Action:** Set `process.env.UV_THREADPOOL_SIZE = 5;`
- **Observation:** 5 concurrent hashes now finish in roughly the same time.

#### Experiment 5: Hardware Constraints

- **Inference:** Increasing the thread pool size is only beneficial up to the number of **logical CPU cores** available. Beyond that, the OS uses "context switching" (juggling) which increases the time taken for each individual task.

---

## 5. Network I/O: Beyond the Thread Pool

### Experiment 6: Asynchronous Network Requests (`https.request`)

- **Setup:** Making multiple concurrent requests to `google.com` using the `https` module.
- **Observation:** Whether making 1, 6, or 12 requests, the average time per request remains roughly the same (~200-300ms).
- **Inference:** 1. `https.request` does **NOT** use the libuv thread pool. If it did, we would see a performance bottleneck after 4 requests. 2. Network I/O is not affected by the number of CPU cores.

### How it Works: Kernel Delegation

Unlike file operations or crypto tasks, network I/O is a **Network operation**, not a CPU-bound one. libuv delegates this work directly to the **Operating System Kernel**.

- **Native Async Mechanisms:** libuv uses the fastest available method provided by the OS to poll the kernel for request completion:
  - **epoll** (Linux)
  - **kqueue** (macOS/BSD)
  - **IOCP** (Windows)
- **Scalability:** Relying on the kernel makes Node.js extremely scalable for networking, as it isn't limited by a small thread pool, but only by the OS kernel's capacity.

---

## 💡 Modern Context & Gaps (Node v22+)

### io_uring (Linux Performance)

In newer Node.js versions, `io_uring` provides a higher-performance interface for async I/O on Linux, potentially replacing the traditional thread pool method for certain tasks.

### `os.availableParallelism()`

Instead of `os.cpus().length`, use `os.availableParallelism()` in Node v22+ to accurately determine how many threads your hardware can effectively handle in parallel.

### Worker Threads

While the thread pool is for internal Node tasks (I/O, Crypto), the `worker_threads` module allows _you_ to run your own custom CPU-intensive JavaScript on separate threads.

### Built-in Tooling

Node v22+ features native **test runners** and **watch mode** (`node --watch`), which utilize libuv's file watching (`uv_fs_event_t`) more efficiently than older external tools like Nodemon.

### Deprecation: `process.binding`

Avoid using `process.binding('uv')`. It is deprecated. Access internal functionality through official APIs only.

### `fetch` API vs `https.request`

In modern Node (v18+), the global `fetch` API is built-in. It is generally preferred over the older `https.request` for its simpler Promise-based syntax. Under the hood, `fetch` (powered by `undici`) also utilizes the same kernel-delegation mechanisms, ensuring high performance for network I/O.
