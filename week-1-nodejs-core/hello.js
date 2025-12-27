// 1 set of code for understanding basic Node.js features
console.log('Hello from Node.js!');
console.log('Current directory:(for CommonJS)', __dirname);
// console.log('Current directory(for ESM):', import.meta.dirname);
// console.log('Current directory(for ESM):', import.meta.url);
console.log('Current file:(for CommonJS)', __filename);
// console.log('Current file(for ESM):', import.meta.filename);
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log(globalThis === global);

// 2 set of code for understanding basic Node.js features
// What globals exist in Node.js but NOT in browser?
console.log('\n--- Node.js Globals ---');
console.log('typeof global:', typeof global);
console.log('typeof process:', typeof process);
console.log('typeof __dirname:', typeof __dirname);
// console.log('typeof __dirname:', typeof import.meta.dirname);
console.log('typeof __filename:', typeof __filename);
// console.log('typeof __filename:', typeof import.meta.filename);

// What's missing from browser?
console.log('\n--- Browser Globals (will error in Node.js) ---');
try {
  console.log('typeof window:', typeof window);
  console.log(
    "this won't work and result in error. Notice typeof does not throw error",
    window,
  );
} catch (error) {
  console.log('window is not defined in Node.js!');
}

try {
  console.log('typeof document:', typeof document);
  console.log(
    "this won't work and result in error. Notice typeof does not throw error",
    document,
  );
} catch (error) {
  console.log('document is not defined in Node.js!');
}
