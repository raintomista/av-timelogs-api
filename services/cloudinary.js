const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'av-timelogs', 
    api_key: '238536451155192', 
    api_secret: 'FZlNEoTPH1G3qBZa5VpB3j5pLEA'  
});

exports.upload = function(imgPath, callback){
    cloudinary.uploader.upload(imgPath, function(result){
        if(result){
            callback(result);
        } else {
            callback('Error uploading image');
        }
    },{ use_filename: true });
}