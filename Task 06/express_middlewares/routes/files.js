const express = require("express");
const router = express.Router();
const fs = require("fs");
const uploadFormData = require("../middlewares/multerService");
const path = require("path");

// upload file route
router.post('/uploadfile',uploadFormData.uploadFormData,(req,res)=>{
    console.log("Multipart DATA :")
    console.log(req.body);
    console.log(req.file);
    res.json({
        "message": "File Uploaded Successfully"
    });
})

// download a file
router.post("/download",uploadFormData.downloadFile,(req,res)=> {
    const requestedFile = req.body.fileName;
    // res.download('../uploads/builtinM.PNG');
    const filePath = path.join(path.resolve('./'),"uploads",requestedFile);
    console.log(filePath,__dirname)
    if(fs.existsSync(filePath)) {
        res.download(filePath);
    }else {
        res.json({"message":"NO such file directory"});
    }
})


module.exports = router