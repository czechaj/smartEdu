const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const app = express();

// connect db

mongoose.connect('mongodb://localhost/smartedu-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })
.then(() => {console.log("db connected");});

// template engine

app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute)


const port = 3000;
app.listen(port, () => {
  console.log(`application started on port ${port}`);
});
