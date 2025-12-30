import { createServer } from 'node:http';

const PORT = 3000;
const server = createServer((req, res) => {
  const superHero = {
    firstName: 'Bruce',
    lastName: 'Wayne',
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(superHero));
  //   console.log({ req });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
