const express = require('express');
const router = require('./router');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(router);

const port = 4000;
const startServer = () => {
  exec('npm run start:json');
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
