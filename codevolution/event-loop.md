# 6. The Node.js Event Loop

## 1. What is the Event Loop?

Technically, it is a C program that is part of libuv. Conceptually, it is a **design pattern** that orchestrates the execution of synchronous and asynchronous code in Node.js. It is what allows Node to be non-blocking and performant despite having a single-threaded execution model.

---

## 2. Visualizing the Execution Flow

The Node.js runtime handles code across two main areas:

1. **V8 Engine:** Consists of the **Memory Heap** (variable storage) and the **Call Stack** (LIFO - Last In, First Out execution).
2. **libuv:** Handles async tasks via OS Kernel delegation or the Thread Pool.

### How Code Executes:

- **Synchronous Code:** Pushed onto the Call Stack and executed immediately. The main thread is occupied until the stack is empty.
- **Asynchronous Code:** Offloaded to libuv. Once the task completes, the callback isn't immediately pushed to the stack; it must wait for the **Event Loop** to coordinate its entry.

---

## 3. The Six Queues of the Event Loop

The Event Loop is a continuous loop that runs as long as the application is active. Each iteration (tick) processes callbacks from six different queues in a specific order:

### libuv Queues (External)

1. **Timer Queue:** Callbacks from `setTimeout` and `setInterval`.
2. **I/O Queue:** Callbacks from async I/O (e.g., `fs`, `http`).
3. **Check Queue:** Callbacks from `setImmediate` (Node-specific).
4. **Close Queue:** Callbacks from close events (e.g., `socket.on('close', ...)`).

### Microtask Queues (Internal to Node)

These are **not** part of libuv but reside within the Node runtime. They have the highest priority. 5. **nextTick Queue:** Callbacks from `process.nextTick`. 6. **Promise Queue:** Callbacks from native JavaScript Promises.

---

## 4. Order of Execution (Priority Rules)

The Event Loop follows a strict hierarchy. A key rule: **Synchronous code always finishes before the Event Loop even starts.**

Once the Call Stack is empty, the Event Loop follows this order:

1. **Microtask Queues:** `nextTick` queue is processed first, followed by the `Promise` queue.
2. **Timer Queue:** Processed next.
3. **Microtask Check:** After **every** callback in the Timer queue, Node checks and clears the Microtask queues again.
4. **I/O Queue:** Processed next.
5. **Microtask Check:** Clears Microtask queues again.
6. **Check Queue:** Processed next.
7. **Microtask Check:** Clears Microtask queues again.
8. **Close Queue:** Processed last in the tick.
9. **Final Microtask Check:** One last check before the loop starts the next iteration or exits.

---

## 💡 Modern Context & Gaps (Node v22+)

### Microtask Priority Change

In very old versions of Node.js (before Node 11), microtasks were only executed between phases of the event loop. **Since Node 11 (and confirmed in v22+)**, microtasks are executed immediately after _each_ individual callback in the Timer and I/O phases. This ensures that promises are handled as fast as possible.

### `process.nextTick` vs `setImmediate`

- **`process.nextTick`** is poorly named; it actually runs "immediately" after the current operation finishes, before the event loop continues. Overusing it can actually **starve** the event loop, preventing it from ever reaching the Timer or I/O phases.
- **`setImmediate`** is more "polite"—it queues the task to run in the next "Check" phase of the event loop, allowing other phases to complete first.

### Performance Tip: Avoid Blocking the Loop

Since the Event Loop coordinates all callbacks, any long-running synchronous task in a callback will delay _every other queue_. For example, a heavy `JSON.parse` on a massive string in an I/O callback will delay all `setTimeout` and `Promise` callbacks.

### Event Loop Utilization (ELU)

In modern production environments (Node v22+), you can monitor **Event Loop Utilization**. This metric tells you what percentage of time the loop is doing actual work vs. waiting for I/O. If ELU is consistently high (above 80%), your application is likely "Event Loop Blocked."

# 6. The Node.js Event Loop (Part 2: Microtask Queues)

## 5. Microtask Queues: Experiments & Inferences

### A. Experiment 1: Synchronous Code Priority

This experiment proves that the Event Loop does not even start until the Call Stack is empty.

**Code:**

```javascript
console.log('1');
process.nextTick(() => console.log('this is process.nextTick 1'));
console.log('2');
```

**Output:**

```
1
2
this is process.nextTick 1
```

**Inference:** Synchronous `console.log` statements are executed by the V8 engine immediately. The `nextTick` callback is queued and only executed once the Call Stack is empty.

---

### B. Experiment 2: nextTick vs. Promise Queue

This experiment demonstrates the internal priority within the Microtask phase.

**Code:**

```javascript
process.nextTick(() => console.log('this is process.nextTick 1'));
Promise.resolve().then(() => console.log('this is Promise.resolve 1'));
```

**Output:**

```
this is process.nextTick 1
this is Promise.resolve 1
```

**Inference:** Even though both are microtasks, the **nextTick queue is exhausted entirely before the Promise queue** starts.

---

### C. Experiment 3: Nested Microtasks & Interleaving

This experiment shows how Node handles new microtasks added while already inside the microtask phase.

**Code:**

```javascript
process.nextTick(() => console.log('this is process.nextTick 1'));
process.nextTick(() => {
  console.log('this is process.nextTick 2');
  process.nextTick(() => console.log('this is inner nextTick inside nextTick'));
});
process.nextTick(() => console.log('this is process.nextTick 3'));

Promise.resolve().then(() => console.log('this is Promise.resolve 1'));
Promise.resolve().then(() => {
  console.log('this is Promise.resolve 2');
  process.nextTick(() => console.log('this is inner nextTick inside Promise'));
});
Promise.resolve().then(() => console.log('this is Promise.resolve 3'));
```

**Output:**

```
this is process.nextTick 1
this is process.nextTick 2
this is process.nextTick 3
this is inner nextTick inside nextTick
this is Promise.resolve 1
this is Promise.resolve 2
this is Promise.resolve 3
this is inner nextTick inside Promise
```

**Inference:**

1. The engine exhausts the entire `nextTick` queue, including any new ones added (the inner one), before moving to Promises.
2. If a `nextTick` is added _inside_ a Promise, it won't jump the line of the current Promise queue, but it will execute immediately **after** the Promise queue is finished and **before** the event loop moves to the next phase (Timers).

---

## 6. The "Starvation" Warning

**Code Example of Starvation:**

```javascript
function starve() {
  process.nextTick(starve);
}
starve(); // This will prevent the Event Loop from ever reaching Timers or I/O
setTimeout(() => console.log('This will never run!'), 0);
```

**Inference:** Because the `nextTick` queue is checked continuously until empty, a recursive call creates an infinite loop that prevents the Event Loop from ever moving to the next phase.

---

## 💡 Modern Context & Gaps (Node v22+)

### `queueMicrotask()` Example

Modern Node.js (and Browsers) provide a standardized way to queue microtasks.

```javascript
queueMicrotask(() => console.log('Standardized Microtask'));
```

- **Gap Note:** `queueMicrotask` puts tasks in the **Promise Queue**, not the `nextTick` queue. Therefore, `process.nextTick` will still run before `queueMicrotask`.

### V8's Internal Microtask Policy

In Node v22, the V8 engine has a "Microtask Policy" that is set to `kExplicit`. This means Node.js manually tells V8 when to run microtasks (which is between every phase of the libuv event loop). This is why the interleaving of `nextTick` and `Promises` is so consistent in Node compared to some other JS environments.

---
