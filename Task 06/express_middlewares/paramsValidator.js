// middleware function to validate the params
function paramsValidator(req,res,next) {
    let {name, age, dob, city} = req.body;
    // variable to store the error message
    let errMsg = {};

    // NAME validation
    if(!name) {
        errMsg["name"] = `'name' parameter is required.\n`;
    }

    // AGE validation
    if(!age) {
        errMsg["age"] = `'age' parameter is required.\n`;
    }else {
        if(isNaN(age)) {
            errMsg["age"] = `${age} is not a valid age. Age should be a number.\n`;
        }

        if(age < 0) {
            errMsg["age"] = `${age} is invalid. Age must be a positive number.\n`;
        }
    }

    // DOB validation
    if(!dob) {
        errMsg["dob"] = `'dob' parameter is required.\n`;
    }else {
        const pattern = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
        if(!pattern.test(dob)) {
            errMsg["dob"] = `'${dob}', Invalid format. Provide dob in 'DD-MM-YYYY' format only.\n`;
        }
    }

    // CITY validation
    if(!city) {
        errMsg["city"] = `'city' parameter is required.\n`;
    }
    
    // checking whether the validation failed, if failed we will have a VALID STRING stored in errMsg variable
    if(Object.keys(errMsg).length > 0) {
        res.json({"ERRORs":errMsg});
    }else {
        next();
    }
}

module.exports = paramsValidator;
