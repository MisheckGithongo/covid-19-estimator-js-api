const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  next();
});


app.use(bodyParser.json());

app.use('/api/v1', routes);

module.exports = app;
