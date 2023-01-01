const express = require("express");
const router = express.Router();
const User = require("../model/user"); // DB User model
const uploadFormData = require("../middlewares/multerService");

// third party middlewares
const bodyParser = require("body-parser"); // to parse the req and to get access to the req.body
const cookieParser = require("cookie-parser"); // to parse the cookies sent in the request
const morgan = require("morgan"); // to write logs for each server response

const fs = require("fs");
const path = require("path");

const paramsValidator = require("../paramsValidator"); // to validate the params




// creating writing streams to write the logs
const insertUserStream = fs.createWriteStream(path.join("D:\\express\\exercise01_bodyparser\\logs\\insertUser\\","allLogs.log"), {flags:'a'});
const insertUserErrorStream = fs.createWriteStream(path.join("D:\\express\\exercise01_bodyparser\\logs\\insertUser\\","allErrorLogs.log"),{flags:'a'});


router.use(bodyParser.json()); // using the body-parser middleware to parse all json data supplied in request body
router.use(cookieParser()); // to parse the cookies coming along with the request.

// logs only the error responses to the conosole
router.use(morgan("dev",{
    skip: function(req,res) {
        return res.statusCode<400;
    }
}))
// logs all the responses to the log file
router.use(morgan("tiny",{stream:insertUserStream}));

// logs only error messages to insertUserError file
router.use(morgan("tiny",{
    stream: insertUserErrorStream,
    skip: (req,res)=>{
        return res.statusCode<400; // skips all responses with status code less than 400
    }
}))

// insert user route
router.post('/insertuser',paramsValidator,(req,res)=> {
    let {name, age, dob, city} = req.body;
    // formatting the dob to YYYY-MM-DD format to store in DB.
    dob = dob.split('-').reverse().join('-');
    // creating instance of User model
    const newUser = new User({
        name,
        age,
        dob,
        city
    })
    // saving the new user in DB
    newUser.save((err,insertedData)=>{
        if(err) {
            res.send(err);
        }else {
            res.status(200);
            res.cookie("user name",name); // sending a cookie to store in the browser's cookie header
            res.cookie("user age",age);
            res.json({
                "message":"Insertion Successful"
            });
        }
    })
    console.log("Cookies",req.cookies);
})


// exporting the router
module.exports = router;