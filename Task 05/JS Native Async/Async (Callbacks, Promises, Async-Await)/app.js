const http = require("http");
const url = require("url");
const dbQueries = require("./services/dbQueries");
const asyncQuery = require("./async_queries");
require('dotenv').config() // for accessing the data in the .env file

const app = http.createServer(async (req,res) => {
    const parsedURL = url.parse(req.url,true);
    const pathName = parsedURL.pathname;
    const params = parsedURL.query;
    res.setHeader("Content-Type","text/html");
    let responseFromDB = {statusCode:200, dbResponse:""};
    // all Valid routes
    const validPaths = ["/insertdetails","/selectdetails","/insertdetails/callback","/insertdetails/promise","/selectdetails/callback","/selectdetails/promise","/insertdetails/async_await","/selectdetails/async_await","/selectandinsert/promise","/selectandinsert/async_await"];

    // initial check for a valid route
    if(validPaths.includes(pathName)) {
        if(pathName === "/insertdetails") {
            try {
                 responseFromDB = await dbQueries.insertIntoDB(params);
            } catch(err) {
                 responseFromDB = err;
            }
        } else if(pathName === "/selectdetails") {
            try {
                responseFromDB = await dbQueries.selectFromDB();
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/insertdetails/callback") {
            try {
                responseFromDB = await asyncQuery.insertUsingCallback(params,dbQueries.insertIntoDB);
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/insertdetails/promise") {
            try {
                responseFromDB = await asyncQuery.insertUsingPromise(params);
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/selectdetails/callback") {
            try {
                responseFromDB = await asyncQuery.selectUsingCallback(dbQueries.selectFromDB);
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/selectdetails/promise") {
            try {
                responseFromDB = await asyncQuery.selectUsingPromise();
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/insertdetails/async_await") {
            try {
                responseFromDB = await asyncQuery.insertUsingAsyncAwait(params);
            } catch(err) {
                responseFromDB = err;
            }
        } else if(pathName === "/selectdetails/async_await") {
            try {
                responseFromDB = await asyncQuery.selectUsingAsyncAwait(params);
            } catch(err) {
                responseFromDB = err;
            }
        } else if (pathName === "/selectandinsert/promise") {
            try {
                responseFromDB = await asyncQuery.selectandinsertUsingPromise("student_details_new");
            } catch(err) {
                responseFromDB = err;
            }
        } else if (pathName === "/selectandinsert/async_await") {
            try {
                responseFromDB = await asyncQuery.selectandinsertUsingAsyncAwait("student_details_new")
            } catch(err) {
                responseFromDB = err;
            }
        }
    } else {
        res.statusCode = 404;
        res.write("Page Not Found, Invalid Path");
    }
    res.statusCode = responseFromDB.statusCode;
    res.write('' + responseFromDB.dbResponse);
    res.end();
})


app.listen(process.env.PORT, ()=> console.log('Server is running..'));

