var express = require('express');
var router = express.Router();

var route = router.route('/user');
var routeParam = router.route('/user/:id');

var User = require('../models/user');
var mongoInterface = require('../library/mongoInterface');

route
    .get(function(req, res) {
        var queryOptions = {
            where : req.query
        };

        User.find(queryOptions.where)
         .select({'_id': 0, 'password': 0, 'email': 0})
         .exec(function(err, docs) {
            if (err) {
                return res.status(500).json({ message: 'Error: Unable to retrieve results from database.'}); 
            }
            else {
                var dataObj = docs;
                return res.status(200).json({ message: 'Retrieved Data', data: dataObj });
            }
        });
    })
    .post(function(req, res) {
        if (!req.body.firstName || !req.body.lastName || !req.body.email) {
            res.status(500).json({ message: "Error! A valid name and email is required."});
        }
        else {
            var params = {
                name: req.body.firstName + ' ' + req.body.lastName,
                email : req.body.email,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                password : req.body.password,
                receipts : []
            };
            mongoInterface.findAndAdd('email', params.email, User, res, params);
        }
    })
    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });

routeParam 
    .get(function(req, res) {
        var id = req.params.id;
        res.status(200).json({ message: 'user param test Route Works ' + id });
    })
    .delete(function(req, res) {
        if (!req.params.id) {
             res.status(500).json({ message: 'Validation Error: An id is required.' }); 
        }
        else {
            mongoInterface.findAndDelete('_id', req.params.id, User, res);
        }
    });

module.exports = router;