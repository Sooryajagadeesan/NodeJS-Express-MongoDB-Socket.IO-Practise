const multer = require("multer"); // to handle multipart form data
const fs = require("fs");

// custom middleware
function uploadFormData(req,res,next) {
    const uploadsStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
    const formData = multer({ storage: uploadsStorage }); // creating an instance of multer
    const multipartMiddleware = formData.single('myFile') // this line generates only the reference to the middleware
    multipartMiddleware(req,res,next); // calling the third party middleware
}


function downloadFile(req,res,next) {
    const formData = multer(); // creating an instance of multer
    const multipartMiddleware = formData.none() // this line generates only the reference to the middleware
    multipartMiddleware(req,res,next); // calling the third party middleware
}



module.exports = {
    uploadFormData,
    downloadFile
};