const moment = require('moment');
const vars = require('../../../../vars');
const Timelog = require('../../../../models/timelog');
const User = require('../../../../models/user');


const office_start = moment().startOf('day').add(9, 'hours');
const late = moment().startOf('day').add(10, 'hours').add(1, 'minutes');







module.exports = function(req, res, next){
    // let timeIn = function(newObject){
    let time = moment();
    // newObject.date = time.format('MMMM DD, YYYY');
    // newObject.timeIn = time.format('h:mm:ss A');
    // newObject.isLate = time.isBetween(office_start, late) ? false : true;

    let newObject = {
        username: req.params.username,
        // date: null,
        timeIn: moment().toDate(),
        timeOut: null,
        // isLate: null
    }
    let newTimelog = new Timelog(newObject);
    

    newTimelog.save(function(err, timelog){
        if(!err){
            res.send(200, {
                code: vars.CODE_SUCCESS,
                msg: "Successfully timed in",
                data: timelog
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
    
//     newTimelog.save(function(err, result){
//         return Promise.resolve(result);
//     })
// }

//     timeIn.then(function(fulfilled){
//         res.send(200, {
//             code: vars.CODE_SUCCESS,
//             msg: "Successfully timed in",
//             data: fulfilled
//         });
//     }).catch(function(error){
//         res.send(500, {
//             code: vars.CODE_SUCCESS_ERROR,
//             msg: vars.CODE_SUCCESS_ERROR,
//             err: error
//         });
//     });
    
// }