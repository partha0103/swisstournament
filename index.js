"use strict"
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require('morgan');
var port = process.env.PORT || 8000;
var mysql = require("mysql");
var passport = require('passport');
var flash    = require('connect-flash');
var routes = require('./api/routes/routes.js');
var session      = require('express-session');
var fileStore = require('session-file-store')(session);
var handlebars = require('express-handlebars')
.create({
    extname: '.hbs'
});

var file = {
    path: "./tmp/session",
    useAsync: true,
    reapInterval: 5000,
    maxAge: 100000
}



app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
// required for passport
app.use(session({
    store: new fileStore(file),
    secret: 'parthasarathi',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static('public'))
require('./config/passport')(passport);

routes(app, passport);
app.listen(port, ()=>{
    console.log("local host is running");
})
