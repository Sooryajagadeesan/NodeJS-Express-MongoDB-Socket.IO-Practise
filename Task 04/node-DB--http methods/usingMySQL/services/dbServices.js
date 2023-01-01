const mysql = require("mysql");
const  returnValidationResult = require("./paramsValidator")
const createMyConnection = require("./dbPool");

// name of the table used
const TABLE = "user_details";

// insert data into DB
function insertIntoDB(res,name,age,dob,email) {
    const fields = {
        name,
        age,
        dob,
        email
    }
    // get the result of validation
    const validationStatus =  returnValidationResult(res,fields)
    // if validation fails end the response and execution here,
    if (validationStatus) {
        // converting the date format to save in the DB
        dob = dob.split('-').reverse().join('-');
        const query = {
            sql : "INSERT INTO ?? (name,age,dob,email) VALUES ?",
            values: [TABLE,[[name,age,dob,email]]]
        }
        // get the connection from pool and query the DB
        createMyConnection(res,"insert",query);
    } else {
        res.end();
        return;
    } 
}

// get data by ID
function getDetailsByID(res,id) {
    const fields = {id}

    // get the result of validation
    const validationStatus = returnValidationResult(res,fields);
    // if validation fails end the response and execution here,
    if (! validationStatus) {
        res.end();
    } else {
        const query = {
            sql: "SELECT * FROM ?? WHERE ?? = ?",
            values: [TABLE,"id",id]
        }
        // get the connection from pool and query the DB
        createMyConnection(res,"select",query);
    } 
}

// update email by ID
function updateEmailByID(res,id,newEmail) {
    const fields = {id, "email":newEmail};

    // get the result of validation
    const validationStatus = returnValidationResult(res,fields);
    // if validation fails end the response and execution here,
    if (! validationStatus) {
        res.end();
    } else {
        const query = {
            sql: "UPDATE ?? SET ?? = ? WHERE ?? = ?",
            values: ["user_details","email",newEmail,"id",id]
        }
        // get the connection from pool and query the DB
        createMyConnection(res,"update",query);
    }
}


// select all data
function selectAllRecords(res) {
    const query = {
        sql: "SELECT * FROM ?? ",
        values: TABLE
    }
    // get the connection from pool and query the DB
    createMyConnection(res,"select",query);
}


//  export the functions
module.exports = {
    insertIntoDB,
    getDetailsByID,
    updateEmailByID,
    selectAllRecords
}