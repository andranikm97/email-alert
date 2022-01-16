const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use(router);

const startJSONServer = () => {
  server.listen(3000);
};

module.exports = startJSONServer;
