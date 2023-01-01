const http = require("http");
const url = require("url");
const validator = require("validator");
const dbServices = require("./services");

const PORT = 3000;
// create server
const app = http.createServer((req,res) => {
    const parsedURL = url.parse(req.url,true); //parsing the URL

    const pathName = parsedURL.pathname;
    const query = parsedURL.query; // query stored as Object.

    res.setHeader('Content-Type','text/html');
    if (pathName === "/insertdetails"){
        let {name,age,dob,email} = query;
        const validationResults = [
            paramsValidator(res,name,"name"),
            paramsValidator(res,age,"age"),
            paramsValidator(res,dob,"dob"),
            paramsValidator(res,email,"email"),
        ];
        const validationStatus = validationResults.every( (result) => result === true);
        if (validationStatus) {
            dob = dob.split('-').reverse().join('-');
            dbServices.insertIntoDB(res,name,age,dob,email);
        } else {
            res.end();
        }
    } else if (pathName === "/getdetails") {
        const id = query.id;
        const validationStatus = paramsValidator(res,id,"id");
        if (validationStatus) {
            dbServices.getDetailsByID(res,id);
        } else {
            res.end();
        }
    } else if (pathName === "/updatedetails"){
        const id= query.id;
        const newEmail = query.email;
        const validationResults = [
            paramsValidator(res,id,"id"),
            paramsValidator(res,newEmail,"email")
        ];
        const validationStatus = validationResults.every((result) => result === true);
        if (validationStatus) {
            dbServices.updateEmailByID(res,id,newEmail);
        } else {
            res.end();
        }
    } else if (pathName === "/selectall") {
        dbServices.selectAll(res);
    } else {
        res.statusCode = 404;
        res.end("Invalid Path");
    }
})

app.listen(PORT, ()=> console.log(`Server is started at PORT ${PORT}`));

// validator to validate the URL params
function paramsValidator(res,field,fieldName) {
    let status = true;
    if (! field  || validator.isEmpty(field, {ignore_whitespace: true})) {
        res.statusCode = 404;
        res.write(`'${fieldName}' parameter is required.\n`);
        status = false;
    } else {
        if (fieldName === "dob" && ! validator.isDate(field, {format:"DD-MM-YYYY", delimiters: ['-']})) {
            res.statusCode = 400;
            res.write(`'${field}' is not a valid date.\nPreferred format is DD-MM-YYYY\n`);
            status = false;
        } 
    
        if (fieldName === "email" && ! validator.isEmail(field)) {
            res.statusCode = 400;
            res.write(`'${field}' is not a valid email.\n`);
            status = false;
        }

        if (fieldName ==="age" && ! validator.isInt(field)) {
            res.statusCode = 400;
            res.write(`'${field}' is not a valid age\n`);
            status = false;
        }
    } 

    if (status) {
        return true;
    } else {
        return false;
    }
   
}
