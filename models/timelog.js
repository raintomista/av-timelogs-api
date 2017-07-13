const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timeLogSchema = mongoose.Schema({
    _user: { type: Schema.ObjectId, ref: 'User'},
    timeIn: Date,
    timeOut: Date,
    lateHrs: Number,
    totalHrs: Number
});

module.exports = mongoose.model('Timelog', timeLogSchema);
