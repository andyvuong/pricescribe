/**
 * Stores receipt meta-data
 */
var mongoose = require('mongoose');

var ReceiptSchema = new mongoose.Schema({
    userId: String, // user id uploading the data
    total: Number,
},
{
    timestamps: { createdAt: 'created_at' }
});

// Export the Mongoose model
module.exports = mongoose.model('Receipt', ReceiptSchema);