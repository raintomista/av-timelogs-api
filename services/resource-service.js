const moment = require('moment');

exports.secondsToDuration = function(seconds){
    if(seconds < 60){
        return `00:00:${moment.duration(seconds, 'seconds').format('ss')}`
    }
    else if(seconds < 3600){
        return `00:${moment.duration(seconds, 'seconds').format('mm:ss')}`
    }
    return moment.duration(seconds, 'seconds').format("hh:mm:ss");
}

exports.formatUserDurationOnly = function(result){;
    let user = result.toObject();
    user.totalHours = this.secondsToDuration(user.totalHours);
    user.totalOffset = this.secondsToDuration(user.totalOffset);
    return user;
}

exports.formatOffsetDurationOnly = function(results){
    let formattedData = [];

    results.forEach(result => {
        let data = result.toObject();
        data.totalHrs = this.secondsToDuration(data.totalHrs);
        formattedData.push(data);     
    });

    return formattedData;
}

exports.formatTimelogsDurationOnly = function(results){
    let formattedData = [];

    results.forEach(result => {
        let data = result.toObject();
        data.lateHrs = this.secondsToDuration(data.lateHrs);
        data.totalHrs = this.secondsToDuration(data.totalHrs);
        formattedData.push(data);     
    });

    return formattedData;
}


exports.formatDurationData = function(results){
    let formattedData = [];

    results.forEach(result => {
        let data = result.toObject();
        if(data._timelog){
            data._timelog.lateHrs = this.secondsToDuration(data._timelog.lateHrs);
            data._timelog.totalHrs = this.secondsToDuration(data._timelog.totalHrs);
        }
        if(data._offset){
            data._offset.totalHrs = this.secondsToDuration(data._offset.totalHrs);                
        } 
        formattedData.push(data);     
    });
    return formattedData;
}