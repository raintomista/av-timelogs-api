const api = module.parent.exports.api;
const core = require('../../services/core-service');

const get_all_offset_by_user_v1 = require('./_v/_v1/get_all_offset_by_user');
const set_offset_valid_v1 = require('./_v/_v1/set_offset_valid');
const set_offset_invalid_v1 = require('./_v/_v1/set_offset_invalid');
const add_offset_remark_v1 = require('./_v/_v1/add_offset_remark');
const get_all_offsets_v1 = require('./_v/_v1/get_offset');

api.get({path: '/offset/all'}, core.verifytoken, get_all_offsets_v1);
api.get({path: '/offset/user/:username'}, core.verifytoken, get_all_offset_by_user_v1);
api.put({path: '/offset/:_id/set_valid'},  core.verifytoken, set_offset_valid_v1);
api.put({path: '/offset/:_id/set_invalid'}, core.verifytoken, set_offset_invalid_v1);
api.post({path: '/offset/:_id/add_remarks'}, core.verifytoken, add_offset_remark_v1);


