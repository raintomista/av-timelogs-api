const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');


module.exports = function(req, res, next){
    const query = { username: req.params.username };
    const update = { timeOut: moment().utc() };
    const options = { new: false, sort: {'timeIn': -1}};
    
    Timelog.findOneAndUpdate(query, update, options, function(err, result){

        console.log(result);
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully timed out",
                data: result
            });
        }
        else{
            res.send(500, {
                code: vars.CODE_SUCCESS_ERROR,
                msg: vars.CODE_SUCCESS_ERROR,
                err: err
            });
        }
    });
    
}