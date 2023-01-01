const validator = require("validator");

// function to validate the URL params
function paramsValidator(field,fieldName) {
    let validationMsg = "";
    let statusCode = 200;
    let status = true;

    if (! field  || validator.isEmpty(field, {ignore_whitespace: true})) {
        
        statusCode = 404;
        validationMsg = `'${fieldName}' parameter is required.\n`;
        status = false;
    } else {
        if (fieldName === "dob" && ! validator.isDate(field, {format:"DD-MM-YYYY", delimiters: ['-']})) {
            statusCode = 400;
            validationMsg = `'${field}' is not a valid date.\nPreferred format is DD-MM-YYYY\n`;
            status = false;
        } 
    
        if (fieldName === "email" && ! validator.isEmail(field)) {
            statusCode = 400;
            validationMsg = `'${field}' is not a valid email.\n`;
            status = false;
        }

        if (fieldName === "age" && ! validator.isInt(field)) {
            statusCode = 400;
            validationMsg = `'${field}' is not a valid age\n`;
            status = false;
        }
    } 

    if (status) {
        return [true,200,''];
    } else {
        return [false,statusCode,validationMsg];
    }
   
}

// function to return the results of validattion
function returnValidationResult(fields) {
    let validationResults = [];
    let validationMessage = "";
    let statusCode = 200;
    for (let field in fields) {
        let result = paramsValidator(fields[field],field);
        validationResults.push(result[0]);
        statusCode = result[1];
        validationMessage += result[2];
    }
    const validationStatus = validationResults.every((result) => result === true);
    if (validationStatus === true) {
        return true;
    } else {
        return [statusCode,validationMessage];
    }
}

module.exports = returnValidationResult;