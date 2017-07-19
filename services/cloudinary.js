const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hp00kmapx',
    api_key: '113995928662643',
    api_secret: '_0klt4IJRz2u7XyJbiC8Xx1wYqM'
});

exports.upload = function (imgPath, callback) {
    cloudinary.uploader.upload(imgPath, function (result) {
        if (result) {
            callback(result);
        } else {
            callback('Error uploading image');
        }
    }, {
        use_filename: true
    });
}