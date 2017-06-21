const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'difpoliqi', 
    api_key: '595693556512765', 
    api_secret: 'pb_WGrOv9IKhS8ZKxyFF3zYgJN4'  
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