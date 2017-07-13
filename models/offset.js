const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var offset = mongoose.Schema({
    _user: { type: Schema.ObjectId, ref: 'User'},
    timeIn: Date,
    timeOut: Date,
    totalHrs: Number
});

module.exports = mongoose.model('Offset', offset);
