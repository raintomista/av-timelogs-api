const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String},
    email: {type: String, required: true},
    contactNumber: {type: Number},
    totalHours: {type: Number},
    status: {type: Number},
    imgUrl: {type: String}
});

module.exports = mongoose.model('User', userSchema);