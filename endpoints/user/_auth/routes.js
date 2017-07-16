const api = module.parent.exports.api;
const login_user_v2 = require('./_v/_v2/user_login');

api.post({path: '/user/login'}, login_user_v2);
