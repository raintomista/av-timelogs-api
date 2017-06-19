const api = module.parent.exports.api;
const login_user_v1 = require('./_v/_v1/user_login');

api.post({path: '/user/login'}, login_user_v1);
