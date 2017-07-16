const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var offset = mongoose.Schema({
    _user: { type: Schema.ObjectId, ref: 'User'},
    timeIn: { type: Date },
    timeOut: { type: Date },
    totalHrs: { type: Number, default: 0 },
    isValid: { type: Boolean, default: false},
    remarks: { type: String, default: null }
});

module.exports = mongoose.model('Offset', offset);
