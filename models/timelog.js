const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timeLogSchema = mongoose.Schema({
    _user: { type: Schema.ObjectId, ref: 'User'},
    timeIn: Date,
    timeOut: Date,
    lateHrs: { type: Number, default: 0 },
    totalHrs: { type: Number, default: 0 }
});

module.exports = mongoose.model('Timelog', timeLogSchema);
