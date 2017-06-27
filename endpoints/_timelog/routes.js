const api = module.parent.exports.api;
const core = require('../../services/core-service');

const time_in_v1 = require('./_v/_v1/time_in');
const time_out_v1 = require('./_v/_v1/time_out');
const view_all_timelogs_v1 = require('./_v/_v1/view_timelogs');
const view_all_timelogs_by_user_v1 = require('./_v/_v1/view_all_timelogs_by_user_v1');
const view_all_timelogs_by_date_v1 = require('./_v/_v1/view_all_timelogs_by_date_v1');
const view_timelogs_by_date_range_v1 = require('./_v/_v1/view_timelogs_by_date_range_v1');


api.post({path: '/time-in'}, core.verifytoken, time_in_v1);
api.post({path: '/time-out'}, core.verifytoken, time_out_v1);
api.get({path: '/timelogs/all'}, core.verifytoken, view_all_timelogs_v1);
api.get({path: '/timelogs/user/:username'}, core.verifytoken, view_all_timelogs_by_user_v1);
api.get({path: '/timelogs/date/:date'}, core.verifytoken, view_all_timelogs_by_date_v1);
api.get({path: '/timelogs/user/:username/date/:startDate/:endDate'}, core.verifytoken, view_timelogs_by_date_range_v1);
