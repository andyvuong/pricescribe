// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var request = require('request');

// The url of the mongodb instance the server will connect to
var url = 'mongodb://localhost:27017/scribe'

// cors
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
};

// server config
var app = express();

app.use(bodyParser.json());
app.use(allowCrossDomain);

mongoose.connect(url);

// design pattern http://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express
// http://expressjs.com/en/4x/api.html#router.route separate the routes and reduce duplication
// Routes work as middle ware, define them separately and load them

// mongo api routes
var userRoute = require('./routes/userRoute.js');
var receiptRoute = require('./routes/receiptRoute.js');

// app api routes
var accessRoute = require('./routes/accessRoute.js');

// specify the app to use the middleware for the following paths
app.use('/api', userRoute);
app.use('/api', receiptRoute);
app.use('/api', accessRoute);

// serves the files in the public directory
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
//app.listen(process.env.PORT || port);
app.listen(port, '0.0.0.0');



