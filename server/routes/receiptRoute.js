var express = require('express');
var router = express.Router();
var Receipt = require('../models/receipt');
var mongoInterface = require('../library/mongoInterface');
var imageProcessor = require('../library/imageProcessor');
var ocrProcessor = require('../library/ocrProcessor');
var fs = require('fs');

var multer  = require('multer')
var upload = multer({ dest: 'data/uploads' }); // where the file will be saved

var route = router.route('/receipt');
var routeParam = router.route('/receipt/:id');

// Store processing instance, exchange processing instance, uploading component
route
    .get(function(req, res) {
        var queryOptions = {
            where : req.query
        };

        Receipt.find(queryOptions.where)
         .sort({created_at: 1})
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
    .post(upload.single('file'), function (req, res, next) {
        // where the files are stored
        var path = '/vagrant/Final3/data/uploads/'
        file = req.file;

        // id used to identify which user receipt data is associated with
        var id = req.body.id;
        
        /**
         * Begin image processing pipeline
         */
        imageProcessor.processImage(req, res, function(err, text) {
            if (err) {
                console.log("An Error Occured! " + err)
                res.status(500).json({ message: err });
            }
            else { 
                /**
                * Extract information from OCR-ed text after the image was processed
                */
                ocrProcessor.processText(text, function(error, data) {
                    if (error) {
                        console.log("An Error Occured! " + error)
                        res.status(500).json({ message: error });
                    }
                    else {
                        console.log('Process: OCR text was processed')
                        // add the receipt data to the mongoDB once it has been processed
                        var params = {
                            userId: id,
                            total: parseFloat(data)
                        };

                        mongoInterface.addModelInstanceToDB(Receipt, params, function(addErr, text) {
                            if (addErr) {
                                console.log('Adding receipt error!');
                                res.status(500).json({ message: addErr });
                            }   
                            else {
                                console.log('Process: Data saved!')
                                res.status(200).json({ message: 'Image Processing Completed Succesfully!' });
                            }
                        });  
                    }
                })
            }
        });
    })
    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });

routeParam
    .get(function(req, res) {
        var id = req.params.id;
        res.status(200).json({ message: 'receipt param test Route Works ' + id });
    })
    .delete(function(req, res) {
        if (!req.params.id) {
             res.status(500).json({ message: 'Validation Error: An id is required.' }); 
        }
        else {
            mongoInterface.findAndDelete('_id', req.params.id, Receipt, res);
        }
    });

module.exports = router;