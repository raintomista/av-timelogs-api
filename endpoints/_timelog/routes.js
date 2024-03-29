const api = module.parent.exports.api;
const core = require('../../services/core-service');

const time_in_v2 = require('./_v/_v2/time_in');
const time_out_v2 = require('./_v/_v2/time_out');
const get_all_timelogs_v2 = require('./_v/_v2/get_timelogs');
const get_all_timelogs_by_user_v2 = require('./_v/_v2/get_all_timelogs_by_user');
const view_all_timelogs_by_date_v1 = require('./_v/_v1/view_all_timelogs_by_date_v1');
const get_all_timelogs_by_date_range_v2 = require('./_v/_v2/get_all_timelogs_by_data_range');

api.post({path: '/time-in'}, core.verifytoken, time_in_v2);
api.post({path: '/time-out'}, core.verifytoken, time_out_v2);
api.get({path: '/timelogs/all'}, core.verifytoken, get_all_timelogs_v2);
api.get({path: '/timelogs/user/:username'}, core.verifytoken, get_all_timelogs_by_user_v2);
api.get({path: '/timelogs/date/:date'}, core.verifytoken, view_all_timelogs_by_date_v1);
api.get({path: '/timelogs/user/:username/date/:startDate/:endDate'}, core.verifytoken, get_all_timelogs_by_date_range_v2);
