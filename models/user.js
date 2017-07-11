const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String},
    email: {type: String, required: true},
    contactNumber: {type: String},
    totalHours: {type: String},
    status: {type: Number},
    imgUrl: {type: String},
    _timelog: { type: Schema.ObjectId, ref: 'Timelog'},
    isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema);