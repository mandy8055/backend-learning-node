# Path Module Revision Guide - Practice Scenarios

## 1. The Basics - Joining vs. Navigating

### Scenario 1.1: Simple Join

```typescript
path.join('src', 'assets');
```

**Hint:** What does `join` do? Does it care about your current location?

### Scenario 1.2: Simple Resolve

```typescript
path.resolve('src', 'assets');
```

**Hint:** Does `resolve` give you a relative or absolute path? Where does it start from?

---

## 2. The "Leading Slash" Reset

### Scenario 2.1: Join with Leading Slash

```typescript
path.join('a', '/b', 'c');
```

**Hint:** How does `join` treat `/b`? Is it special or just another string?

### Scenario 2.2: Resolve with Leading Slash

```typescript
path.resolve('a', '/b', 'c');
```

**Hint:** When `resolve` sees `/b`, does it continue from where it was or does something else happen?

---

## 3. The "Backwards" Step (`..`)

### Scenario 3.1: Join with Parent Directory

```typescript
path.join('src', '..', 'css');
```

**Hint:** Trace the path: go into src, then where does `..` take you, then where does css take you?

### Scenario 3.2: Resolve with Parent Directory

```typescript
path.resolve('src', '..', 'css');
```

**Hint:** Does `resolve` navigate against a real disk location? What's the starting point?

---

## 4. The "Empty" Arguments

### Scenario 4.1: Join with No Arguments

```typescript
path.join();
```

**Hint:** What does "current relative spot" mean?

### Scenario 4.2: Resolve with No Arguments

```typescript
path.resolve();
```

**Hint:** Where are you physically standing when you run the command?

---

## 5. Multiple Absolute Paths (The Tricky One!)

### Scenario 5.1: Three Absolute Paths

```typescript
path.resolve('/a', '/b', '/c');
```

**Hint:** Start from the right. Is `/c` absolute? If yes, what happens to `/a` and `/b`?

### Scenario 5.2: Mixed Paths

```typescript
path.resolve('/a', 'b', '/c', 'd');
```

**Hint:** Right-to-left: `d` is relative, `/c` is absolute. What gets ignored?

### Scenario 5.3: Absolute at Different Positions

```typescript
path.resolve('a', '/b', 'c', 'd');
```

**Hint:** Where does the processing stop when moving right-to-left?

## Edge Case: Multiple Absolute Paths

**The "Last One Wins" Rule**  
When you pass multiple absolute paths (paths starting with `/`) into `path.resolve()`, it processes from **right to left** and stops as soon as it finds an absolute path. Everything to the left of that "stop" is completely ignored.

**Scenario:**

```typescript
path.resolve('/folder1', '/folder2', 'sub-folder');
```

**Hint:** `resolve` starts at the right. It sees `sub-folder`, then it sees `/folder2`. Since `/folder2` is absolute, it has everything it needs. What happens to `/folder1`?

---

## Pro Concepts to Remember

### `__dirname` vs `process.cwd()`

**Scenario A:**

```typescript
path.join(__dirname, 'file.js');
```

**Hint:** Where is the file located? Does this change based on where you run the command?

**Scenario B:**

```typescript
path.join(process.cwd(), 'file.js');
```

**Hint:** Where were you standing in the terminal when you ran the command? Can this change?

---

## Practice Questions

1. Why is `path.join(__dirname, 'file')` more portable than `path.join(process.cwd(), 'file')`?

2. If you have `/root/project` as your current directory and run `path.resolve('src', 'assets')`, what do you expect?

3. What's the fundamental difference in how `join` and `resolve` handle their arguments?

4. Can `path.join()` ever give you an absolute path?

5. Can `path.resolve()` ever give you a relative path?

---

## Quick Reference Table

| Method    | Code                            | Logic                                  |
| --------- | ------------------------------- | -------------------------------------- |
| `join`    | `path.join('src', 'assets')`    | Just glues segments together           |
| `resolve` | `path.resolve('src', 'assets')` | Finds the full absolute path from root |

---

**Remember:** When you revise, actually write down the outputs for each scenario. Then verify by running the code!
