const  multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'ecommerce',
        allowed_formats : ['jpg','png','jpeg','webp'],
    }
})

const upload = multer ({ storage : storage});

module.exports = upload;