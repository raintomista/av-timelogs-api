const api = module.parent.exports.api;
const get_user_v1 = require('./_v/_v1/get_users');
const get_user_by_username = require('./_v/_v1/get_user_by_username');
const get_users_by_status = require('./_v/_v1/get_users_by_status');


api.get({path: '/users/all'}, get_user_v1);
api.get({path: '/users/:username'}, get_user_by_username);
api.get({path: '/users/status/:status'}, get_users_by_status);
