const mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String},
    email: {type: String, required: true},
    contactNumber: {type: Number},
    imgUrl: {type: String}
});

module.exports = mongoose.model('Admin', adminSchema);