const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());
// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser('NotSoSecret'));
app.use(session({
  secret: 'flashblog',
  cookie: { maxAge: 60000 },
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

// app.use(function(req,res,next){
//   res.locals.message = req.flash();
//   next();
// })
// Parse URL-encoded bodies


const Routes = require('./routes/index');



app.use('/', Routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});