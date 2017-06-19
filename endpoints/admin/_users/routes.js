const api = module.parent.exports.api;
const get_user_v1 = require('./_v/_v1/get_users');
const get_users_by_status = require('./_v/_v1/get_users_by_status');


api.get({path: '/users/all'}, get_user_v1);
api.get({path: '/users/:status'}, get_users_by_status);
