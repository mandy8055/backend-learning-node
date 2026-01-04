export default class EventEmitter {
  constructor() {
    this.subscriptions = new Map();
  }

  on(eventName, listener) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
    }
    this.subscriptions.get(eventName).push(listener);
    return this;
  }

  off(eventName, listener) {
    const listeners = this.subscriptions.get(eventName);
    if (!listeners) return this;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.subscriptions.delete(eventName);
    }

    return this;
  }

  emit(eventName, ...args) {
    const listeners = this.subscriptions.get(eventName);
    if (!listeners) return false;
    const snapshot = [...listeners];
    snapshot.forEach((l) => l.call(this, ...args));
    return true;
  }
}
