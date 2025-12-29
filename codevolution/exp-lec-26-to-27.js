// import fs from 'node:fs';
// import { resolve } from 'node:path';

// // Synchronous way of reading file
// // const fileContent = fs.readFileSync(
// //   resolve(import.meta.dirname, 'test-file.txt'),
// //   'utf-8',
// // );
// // console.log(fileContent);

// // Asynchronous version of reading the file
// fs.readFile(
//   resolve(import.meta.dirname, 'test-file.txt'),
//   { encoding: 'utf-8' },
//   (err, content) => {
//     if (err) {
//       throw err;
//     }
//     console.log(content);
//   },
// );
// console.log('Hello there!');

// import { readFile } from 'node:fs/promises';
// import { resolve } from 'node:path';

// readFile(resolve(import.meta.dirname, 'test-file.txt'), 'utf-8')
//   .then((content) => console.log(content))
//   .catch((err) => console.log(err));

// try {
//   const fileContent = await readFile(
//     resolve(import.meta.dirname, 'test-file.txt'),
//     'utf-8',
//   );
//   console.log(fileContent);
// } catch (error) {
//   console.log(error);
// }
