const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },    
    email: { type: String, required: true },
    contactNumber: { type: String, default: null },
    imgUrl: { type: String },    
    totalHours: { type: Number, default: 0 },
    totalOffset: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    isAdmin: {type: Boolean, default: false},
    isSuspended: { type: Boolean, default: false },        
    _timelog: { type: Schema.ObjectId, ref: 'Timelog', default: null },
    _offset: {  type: Schema.ObjectId, ref: 'Offset', default: null }
});

module.exports = mongoose.model('User', userSchema);