const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const bodyParser = require('body-parser');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

// connect db
mongoose
  .connect('mongodb://localhost/smartedu-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connected');
  });


// template engine
app.set('view engine', 'ejs');

// global variables

global.userIn = null


//middlewares
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'my_key_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartedu-db' })
}));
app.use(flash());
app.use((req,res,next) => {
  res.locals.flashMessages = req.flash();
  next() 
});
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);



// routes
app.use('*', (req,res,next) => {
  userIn = req.session.userID;
  next()
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);




const port = 3000;
app.listen(port, () => {
  console.log(`application started on port ${port}`);
});
