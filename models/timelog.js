const mongoose = require('mongoose');

var timeLogSchema = mongoose.Schema({
    username: {type: String},
    timeIn: Date,
    timeOut: Date,
});

module.exports = mongoose.model('Timelog', timeLogSchema);
