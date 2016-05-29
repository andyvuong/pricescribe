var fs = require('fs');
var tesseract = require('node-tesseract');
var spawn = require('child_process').spawn;

/**
 * Image preprocessing: Convert the image into a higher DPI
 */
function convertDpiCommand(fileInput, fileOutput, callback) {
    var converter = spawn('convert', ['-units', 'PixelsPerInch', fileInput, '-density', '300', fileOutput])
    converter.on('exit', function(chunk) {
        callback(null, fileOutput);
    });
    converter.on('error', function(chunk) {
        if (converter) {
            converter.kill();
        }
        callback('An error has occured', null);
    });
}

/**
 * Image preprocessing: Convert the image to greyscale, remove noise, add some filters.
 * Helper Script: textcleaner attributed to Fred Weinhaus
 */
function convertTextCleanedCommand(fileInput, fileOutput, callback) {
    var path = '/vagrant/Final3/'
    var converter = spawn(path + 'textcleaner', ['-g', '-e', 'stretch', '-f', '50', '-o', '15', '-s', '2', fileInput, fileOutput])
    var data = '';
    converter.stderr.on('data', function(chunk) {
        data += chunk;
    });
    converter.on('exit', function(chunk) {
        callback(null, fileOutput);
    });
    converter.on('error', function(chunk) {
        if (converter) {
            converter.kill();
        }
        console.log(data);
        callback('An error has occured', null);
    });
}

/**
 * Image preprocessing: Resize the image
 */
function resizeImage(fileInput, fileOutput, callback) {
    var converter = spawn('convert', [fileInput, '-resize', '1500', fileOutput])
    converter.on('exit', function(chunk) {
        callback(null, fileOutput);
    });
    converter.on('error', function(chunk) {
        if (converter) {
            converter.kill();
        }
        callback('An error has occured', null);
    });
}

/**
 * Main image processing pipeline that ties together the preprocessing steps above.
 * First, conver the image dpi, clean it by adding a greyscale, reducing noise, and finally resize it.
 * After preprocessing, run OCR on the image
 */
function process(req, res, callback) {
        var path = '/vagrant/Final3/data/uploads/'
        convertDpiCommand(path + req.file.filename, path + 'dpi_converted.png', function(err, inputDpi) {
        if (err) {
            callback('Error converting image dpi.', null);
        } 
        else {
            console.log('Process: DPI Conversion Completed');
            resizeImage(inputDpi, path + 'text_resized.png', function(err, inputResize) {
                if (err) {
                    callback('Error resizing image', null);
                }
                else {
                    console.log('Process: Resize Completed');
                    convertTextCleanedCommand(inputResize, path + 'text_cleaned.png', function(err, inputText) {
                        if (err) {
                            callback('Error cleaning image', null);
                        }
                        else {
                            console.log('Process: Text Cleansing Completed');
                            tesseract.processStream(fs.createReadStream(inputText), function(err, text) {
                                if (err) {
                                    callback('Error recognizing characters', null);
                                } 
                                else {
                                    console.log('Process: OCR Completed');
                                    callback(null, text);
                                }
                            });
                        } 
                    })
                } 
            });
        }
    });
}

module.exports = {
    processImage: process
};