const api = module.parent.exports.api;
const core = require('../../../services/core-service');

const get_networks_v1 = require('./_v/_v1/get_networks');
const add_network_v1 = require('./_v/_v1/add_network');
const remove_valid_v1 = require('./_v/_v1/remove_valid');

api.get({path: '/timelogs/host'}, core.verifytoken, get_networks_v1);
api.post({path: '/timelogs/add_host'}, core.verifytoken, add_network_v1);
api.put({path: '/timelogs/remove_host/:_id'}, core.verifytoken, remove_valid_v1);