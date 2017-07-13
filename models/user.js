const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String},
    email: {type: String, required: true},
    contactNumber: {type: String},
    totalHours: {type: Number},
    totalOffset: {type: Number},
    status: {type: Number},
    imgUrl: {type: String},
    isAdmin: {type: Boolean },
    isSuspended: {type: Boolean},        
    _timelog: { type: Schema.ObjectId, ref: 'Timelog' },
    _offset: {  type: Schema.ObjectId, ref: 'Offset' }
});

module.exports = mongoose.model('User', userSchema);