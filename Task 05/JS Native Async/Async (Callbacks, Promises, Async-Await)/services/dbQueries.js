const createConnection = require("./dbPool");

// variable to store the query
let query = {
    sql : "",
    values : []
}

// store the name of table used 
const TABLE = "student_details_old";

// insert data into DB
function insertIntoDB(params,table = TABLE) {
    let {name,dob,email,city} = params;
    query.sql = "INSERT INTO ?? (name,dob,email,city) VALUES ?";
    query.values = [table, [[name,dob,email,city]]]
    return createConnection("insert",query,{name,dob,email,city});
}

// select data from DB
function selectFromDB(table = TABLE) {
    query.sql = "SELECT ?? FROM ??";
    query.values = [['id','name','dob','email','city'],table];
    return createConnection("select",query);
}


// exporting the two functions
module.exports = { insertIntoDB, selectFromDB }