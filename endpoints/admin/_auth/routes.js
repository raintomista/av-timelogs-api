const api = module.parent.exports.api;
const login_admin_v1 = require('./_v/_v1/admin_login');

api.post({path: '/admin/login'}, login_admin_v1);
