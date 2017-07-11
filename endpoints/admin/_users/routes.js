const api = module.parent.exports.api;
const core = require('../../../services/core-service');

const get_user_v1 = require('./_v/_v1/get_users');
const get_user_by_username = require('./_v/_v1/get_user_by_username');
const get_absent_users_v1 = require('./_v/_v1/get_absent_users_v1');
const get_users_by_status = require('./_v/_v1/get_users_by_status');
const create_user_v1 = require('./_v/_v1/create_user');
const edit_user_v1 = require('./_v/_v1/edit_user');
const suspend_user_v1 = require('./_v/_v1/suspend_user_v1');
const unsuspend_user_v1 = require('./_v/_v1/unsuspend_user_v1');


api.get({path: '/users/all'}, core.verifytoken, get_user_v1);
api.get({path: '/users/:username'}, core.verifytoken, get_user_by_username);
api.get({path: '/users/status/:status'}, core.verifytoken, get_users_by_status);
api.get({path: '/users/all/absent'}, core.verifytoken, get_absent_users_v1);
api.post({path: '/users/create'}, core.verifytoken, create_user_v1);
api.patch({path: '/users/edit'}, core.verifytoken, edit_user_v1);
api.post({path: '/users/suspend-user'}, core.verifytoken, suspend_user_v1);
api.post({path: '/users/unsuspend-user'}, core.verifytoken, unsuspend_user_v1);



