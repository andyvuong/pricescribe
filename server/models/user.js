var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    lastName: String,
    password: String, // temp
    email: String,
    receipts: [String] // The _id fields of the user receipts
},
{
    timestamps: { createdAt: 'created_at' }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);