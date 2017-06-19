const api = module.parent.exports.api;
const create_admin_v1 = require('./_v/_v1/create_admin');

api.post({path: '/admin/create'}, create_admin_v1);

