const api = module.parent.exports.api;
const time_in_v1 = require('./_v/_v1/time_in');
const time_out_v1 = require('./_v/_v1/time_out');
const view_all_timelogs_v1 = require('./_v/_v1/view_timelogs');

api.post({path: '/time-in'}, time_in_v1);
api.post({path: '/time-out'}, time_out_v1);
api.get({path: '/timelogs/all'}, view_all_timelogs_v1);