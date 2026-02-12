class CustomEventEmitter {
  constructor() {
    this.subscriptions = new Map(); // Map<eventName, Array<Listeners>>
  }

  on(eventName, listener) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
    }
    this.subscriptions.get(eventName).push(listener);
    return this;
  }

  once(eventName, listener) {
    const wrapperFunction = (...args) => {
      this.off(eventName, wrapperFunction);
      listener.call(this, ...args);
    };

    wrapperFunction.originalFunction = listener;
    return this.on(eventName, wrapperFunction);
  }

  off(eventName, listener) {
    const listeners = this.subscriptions.get(eventName);
    if (!listeners) return this;
    const idx = listeners.findIndex(
      (l) => l === listener || l.originalFunction === listener,
    );

    if (idx !== -1) {
      listeners.splice(idx, 1);
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
