const mongoose = require('mongoose');

var networkSchema = mongoose.Schema({
    hostname: {type: String, required: true},
    ip_address: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Network', networkSchema);
