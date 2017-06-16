const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String},
    email: {type: String, required: true},
    contactNumber: {type: Number},
    timeLogs: [{
    	timeIn: Date,
    	timeOut: Date
    }],
    totalHours: {type: Number},
    logged: {type: Boolean}
});

module.exports = mongoose.model('User', userSchema);


// module.exports.createUser = function(user, callback){
// 	User.create(user, callback);
// }

// module.exports.retrieveUsers = function(callback, limit){
// 	User.find(callback).limit(limit);
// }

// module.exports.retrieveUserById = function(id, callback){
// 	User.findById(id, callback);
// }

// module.exports.updateUser = function(id, user, options, callback){
// 	var query = {_id: id};
// 	var update = {
// 		username: user.username,
// 		password: user.password,
// 		name: user.name,
// 		email: user.email,
// 		contactNumber: user.contactNumber,
// 		timeLogs: user.timeLogs,
// 		totalHours: user.totalHours
// 	}
// 	User.findOneAndUpdate(query, update, options, callback);
// }

// module.exports.deleteUser = function(id, callback){
// 	var query = {_id: id};
// 	User.remove(query, callback);
// }