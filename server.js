const express = require('express');
const router = require('./router');
const startJSONServer = require('./jsonServer');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(router);

const port = 4000;
const startServer = () => {
  startJSONServer();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
