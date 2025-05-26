const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to the Attention Tracker API');
});

app.use(errorHandler);


module.exports = app;
