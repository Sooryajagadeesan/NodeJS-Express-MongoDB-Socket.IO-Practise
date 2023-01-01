const validator = require("validator");

// function to validate the URL params
function paramsValidator(res,field,fieldName) {
    let status = true;

    if (! field  || validator.isEmpty(field, {ignore_whitespace: true})) {
        // res.writeHead(404,{"Content-Type":"text/html"});
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

        if (fieldName === "age" && ! validator.isInt(field)) {
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

// function to return the results of validattion
function returnValidationResult(res,fields) {
    let validationResults = [];
    for (let field in fields) {
        let result = paramsValidator(res,fields[field],field);
        validationResults.push(result);
    }
    const validationStatus = validationResults.every((result) => result === true);
    if (validationStatus) {
        return true;
    } else {
        return false;
    }
}

module.exports = returnValidationResult;