const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserAPI = require('./user/api');

const app = express();
const server = https.createServer(app);

app.use(bodyParser.json());

app.use('/api/v1/users', UserAPI());

const noPageHandler = (req, res) => {
  res.status(404);
  res.json({
    message: 'The page not found',
  })
};

const errorHandler = function () {
  const env = process.env.NODE_ENV || 'development';

  return (err, req, res) => {
    res.status(500);
    if (env === 'development') {
      res.json(err);
    }
    res.json({
      message: 'Server error',
    })
  }
};

app.use(noPageHandler);
app.use(errorHandler());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
}).then(() => {
  server.listen(8888, err => {
    if (err) {
      console.log(`Some thing went wrong. ${err}`);
    } else {
      console.log('Server is running in port 8888');
    }
  });
}).catch(e => {
  console.log(`Error when connect MongoDB Atlas: ${e}`);
});
