/**
 * Returns true if the given string line contains the total.
 */
function isTotal(string) {
    string = string.toLowerCase();
    if ((string.indexOf("total") > -1 && string.indexOf("sub") == -1) || (string.indexOf("amount") > -1)) {
        return true;
    }
    return false;
}

/**
 * Extracts a value from a string.
 */
function getTotalValue(string) {
    var value = Number(string.replace(/[^0-9\.]+/g,""));
    return value;
}

/**
 * Parses OCR-ed text and extracts the total value
 */
function processText(data, callback) {
    var tokens = data.split('\n');
    console.log(tokens);
    var total = '';
    for (var i = 0; i < tokens.length; i++) {
        if (isTotal(tokens[i])) {
            total = tokens[i].toLowerCase();
            break;
        }
    }
    
    if (total) {
        console.log('Total is: ' + total);
        callback(null, getTotalValue(total));
    }
    else {
        callback('Could not parse ocr data correctly!', null);
    }
}

module.exports = {
    processText: processText
};