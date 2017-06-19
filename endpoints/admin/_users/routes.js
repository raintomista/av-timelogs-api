const api = module.parent.exports.api;
const core = require('../../../services/core-service');

const get_user_v1 = require('./_v/_v1/get_users');
const get_user_by_username = require('./_v/_v1/get_user_by_username');
const get_users_by_status = require('./_v/_v1/get_users_by_status');
const create_user_v1 = require('./_v/_v1/create_user');

api.get({path: '/users/:username'}, core.verifytoken, get_user_by_username);
api.post({path: '/users/create'}, core.verifytoken,create_user_v1);
api.get({path: '/users/all'}, core.verifytoken, get_user_v1);
api.get({path: '/users/status/:status'}, core.verifytoken, get_users_by_status);

