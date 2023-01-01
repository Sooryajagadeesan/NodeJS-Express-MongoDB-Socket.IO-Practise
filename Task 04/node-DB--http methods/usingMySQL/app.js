const http = require("http");
const url = require("url");
const dbService = require("./services/dbServices");
const PORT = 3000;

// create server
const app = http.createServer((req,res) => {
    const parsedURL = url.parse(req.url,true);

    const pathName = parsedURL.pathname;
    const query = parsedURL.query;
    res.setHeader('Content-Type','text/html');
    if (pathName === "/insertdetails") {       
        let {name,age,dob,email} = query;
        // inserts data into the DB if the data validation is success        
        dbService.insertIntoDB(res,name,age,dob,email);
    } else if (pathName === "/getdetails") {
        const id = query.id;
        dbService.getDetailsByID(res,id);
    } else if (pathName === "/updatedetails") {
        const id = query.id;
        const newEmail = query.email;
        dbService.updateEmailByID(res,id,newEmail)
    } else if (pathName === "/selectall") {
        dbService.selectAllRecords(res);
    } else {
        res.statusCode = 404;
        res.end("Invalid Path");
    }
    
})



app.listen(PORT, ()=> console.log(`Server is running at PORT : ${PORT}`))