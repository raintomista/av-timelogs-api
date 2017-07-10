const dns = require('dns')
const vars = require('./../../../../../vars');

module.exports = function(req, res, next){
    dns.reverse(req.params.ip, function(err, hostname){
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully fetched hostname",
                data: hostname
            });
        }
        else{
            res.send(500, {
                code: vars.CODE_SERVER_ERROR,
                msg: vars.CODE_SERVER_ERROR,
                err: err
            });
        }
    })
}