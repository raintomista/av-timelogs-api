const api = module.parent.exports.api;
const get_user_v1 = require('./_v/_v1/get_users');

api.get({path: '/users/all'}, get_user_v1);