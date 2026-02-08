# Events Module & EventEmitter

The `events` module is a fundamental part of Node.js that enables **Event-Driven Programming**. It allows you to create, fire, and listen for custom events to build non-blocking applications.

## 1. The `EventEmitter` Class

The `events` module returns a class called `EventEmitter`. To use it, you must instantiate it.

```javascript
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
```

### Core Methods:

- `.emit(eventName, ...args)`: Broadcasts an event. You can pass any number of arguments to be sent to the listeners.
- `.on(eventName, listener)`: Registers a listener (callback function) for a specific event.

### Basic Example:

```javascript
// Registering a listener
emitter.on('order-pizza', (size, topping) => {
  console.log(`Order received! Baking a ${size} pizza with ${topping}.`);
});

// Emitting the event
emitter.emit('order-pizza', 'large', 'mushrooms');
```

## 2. Key Characteristics of Events

- **Non-blocking:** Emitting an event doesn't stop the execution of the code around it.
- **Multiple Listeners:** You can register multiple different listeners for the same single event name.
- **Arguments:** Node.js automatically passes arguments from the `.emit()` call to the callback function in `.on()`.

## 3. Extending from `EventEmitter`

In real-world development, you rarely use a raw `EventEmitter` instance. Instead, you create classes that inherit from `EventEmitter`. This allows your custom objects to have their own internal logic while also being able to emit events.

### Pattern:

1. Use the `extends` keyword.
2. Call `super()` in the constructor to initialize the parent `EventEmitter` logic.

### Example: `PizzaShop` Module

```javascript
// pizzashop.js
const EventEmitter = require('node:events');

class PizzaShop extends EventEmitter {
  constructor() {
    super();
    this.orderNumber = 0;
  }

  order(size, topping) {
    this.orderNumber++;
    // Use 'this.emit' because the class is an EventEmitter
    this.emit('order', size, topping);
  }

  displayOrderNumber() {
    console.log(`Current order number: ${this.orderNumber}`);
  }
}

module.exports = PizzaShop;
```

### Usage in `index.js`:

```javascript
const PizzaShop = require('./pizzashop');
const shop = new PizzaShop();

shop.on('order', (size, topping) => {
  console.log(`Notification: Baking ${size} ${topping} pizza.`);
});

shop.order('large', 'pepperoni');
```

## 4. Why This Matters

Many of Node.js's most important built-in modules—such as `fs` (File System), `stream`, and `http`—are built on top of `EventEmitter`.

- An HTTP server emits a `'request'` event when a client connects.
- A ReadStream emits a `'data'` event when a chunk of a file is read.

By learning this pattern, you understand how the core of Node.js communicates internally without tightly coupling different parts of the system.

## 5. Summary Tip

- **Event-Driven Architecture** is excellent for decoupling modules. For example, a `DrinkMachine` module can listen for a `PizzaShop` event without the `PizzaShop` ever needing to know the `DrinkMachine` exists.
- Always call `super()` in the constructor when extending `EventEmitter`, or the event methods won't be initialized properly!

### Event Emitter Snapshot Pattern

#### Real-World Analogy

Imagine you're a **teacher** giving high-fives to 5 students in a line.

**Without Snapshot:**

1. You high-five Student #1
2. Student #1 leaves the room
3. Everyone shifts up one spot (Student #2 is now where #1 was)
4. You move to "Spot #2," but you actually high-five Student #3
5. **Result:** You accidentally skipped Student #2!

**With Snapshot:**
Take a photo of the line before starting. Even if students leave, you follow your photo and high-five everyone who was originally there.

#### Code Example

```typescript
// WITHOUT SNAPSHOT - The Bug:
const fn1 = () => {
  console.log("Running 1");
  emitter.off('test', fn1); // Removes itself
};

const fn2 = () => console.log("Running 2");

// Loop at index 0: calls fn1
// fn1 removes itself, array becomes [fn2]
// Loop moves to index 1 (empty!)
// RESULT: fn2 never runs

// WITH SNAPSHOT - The Fix:
emit(event: string, ...args: any[]) {
  const snapshot = [...listeners]; // Copy the array
  snapshot.forEach(listener => listener(...args));
}
```

**Key Point:** The snapshot prevents listeners from being skipped when they modify the listener array during emission.
