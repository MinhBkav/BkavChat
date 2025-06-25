global.reqlib = require('app-root-path').require
require('dotenv').config()
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var cors = require('cors')
const multer = require('multer');

var app = express();
const port = process.env.PORT || 8888;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().any())

app.use(cookieParser());
app.use('/api', require('./controllers')())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.get('/test', (req, res) => {
  res.send('✅ Server working!');
});
app.listen(port, () => {
    console.log(`Server listening on http://10.2.44.52:${port}`);
})



const corsOptions = {
  origin: "http://localhost:4001", 
  credentials: true,
};
app.use(cors(corsOptions));

module.exports = app;