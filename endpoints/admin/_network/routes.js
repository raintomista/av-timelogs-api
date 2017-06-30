const api = module.parent.exports.api;
const core = require('../../../services/core-service');

const get_networks_v1 = require('./_v/_v1/get_networks');
const get_network_status_v1 = require('./_v/_v1/get_network_status');
const add_network_v1 = require('./_v/_v1/add_network');
const remove_valid_v1 = require('./_v/_v1/remove_valid');
const set_valid_v1 = require('./_v/_v1/set_valid');
const delete_network_v1 = require('./_v/_v1/delete_network');

api.get({path: '/timelogs/host'}, core.verifytoken, get_networks_v1);
api.post({path: '/timelogs/host/status'}, core.verifytoken, get_network_status_v1);
api.post({path: '/timelogs/add_host'}, core.verifytoken, add_network_v1);
api.put({path: '/timelogs/remove_host/:_id'}, core.verifytoken, remove_valid_v1);
api.put({path: '/timelogs/set_valid/:_id'}, core.verifytoken, set_valid_v1);
api.del({path: '/timelogs/delete_host/:_id'}, core.verifytoken, delete_network_v1);