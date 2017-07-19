const api = module.parent.exports.api;
const core = require('../../services/core-service');

const noon_mailer_v1 = require('./_v/_v1/noon_mailer')
const night_mailer_v1 = require('./_v/_v1/night_mailer')

api.get({path: '/mailer/noon'}, noon_mailer_v1);
api.get({path: '/mailer/night'}, night_mailer_v1);

