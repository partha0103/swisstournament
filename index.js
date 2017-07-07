"use strict"
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require('morgan');
var port = process.env.PORT || 8000;
var mysql = require("mysql");
var passport = require('passport');
var flash    = require('connect-flash');
var routes = require();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
