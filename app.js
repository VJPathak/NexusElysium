const express = require("express");
var bodyParser = require('body-parser');
const app = express();
let path = require("path");
let routes = require("./routes/routes");
const session = require('express-session');
// let session = require('express-session');
// let cookieParser = require('cookie-parser');

// app.use(cookieParser());

// app.use(cookieParser());
 
app.use(bodyParser.json());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// app.use(session({
//     secret: "mySecretKey@12345",
//     saveUninitialized: true,
//     resave: true
// }));
 
// app.use(bodyParser.urlencoded({extended: false}));

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => { 
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
  next(); 
});

app.use(express.static('views'))
app.use('/', routes);
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static('config'))
// app.set('config', path.join(__dirname, 'config'));

//EJS Template
app.set('view engine','ejs');

//Starting the server at port 3000
app.listen(10000, function() { 
  console.log('Server running on port 10000'); 
  console.log("Initiating Our Project :) ");
});
