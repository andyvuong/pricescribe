var express = require('express');
var router = express.Router();

var loginRoute = router.route('/access/login');

var User = require('../models/user');
var mongoInterface = require('../library/mongoInterface');

loginRoute
    .get(function(req, res) {
        res.status(200).json({ message: 'login test Route Works' });
    })
    .post(function(req, res) { 
        // check if the email and password exists, returns the user id as a session
        User.findOne({'email': req.body.email, 'password': req.body.password}, function(err, doc) {
            if (doc) {
                var session = doc._id;
                res.status(200).json({ message: 'Successful login', data: session});
            }
            else {
                res.status(500).json({ message: 'Error! Invalid email or password.' });
            }
        });  

    })
    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });

module.exports = router;