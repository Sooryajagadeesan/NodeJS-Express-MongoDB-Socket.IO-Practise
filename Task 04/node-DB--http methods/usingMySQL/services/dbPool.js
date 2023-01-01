const mysql = require("mysql");

// create a pool of DB connections
const pool = mysql.createPool({
    connectionLimit: 10,
    host:"localhost",
    user:"root",
    password:"soorya18",
    database:"node_DB_exercise"
})

// the name of the table used in the queries
const TABLE = "user_details";

// function to create a connection
function createMyConnection(res,queryName,query) {
    pool.getConnection((err,connection) => {
        if (err) {
            res.statusCode = 500;
            res.end(`Error while connecting to the DB\n${err}`);
        } else {            
            connection.query(query, (err,result) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error while querying '${TABLE}' table, with command : ${queryName}\n${err}`);
                } else {
                    // after querying the results are displayed as per the Command stored in the queryName variable
                    if (queryName === "insert") {
                        res.statusCode = 200;
                        res.end(`Insertion Successful.\nRows Affected : ${result.affectedRows}`);
                    } else if (queryName === "select") {
                        if (result.length > 0) {
                            res.write("RESULT\n");
                            res.statusCode = 200;
                            result.forEach( (row) => {
                                // formatting the data in the DD-MM-YYYY format
                                let dob = row.dob
                                let dd = String(dob.getDate()).padStart(2, '0');
                                let mm = String(dob.getMonth() + 1).padStart(2, '0'); //January is 0!
                                let yyyy = dob.getFullYear();

                                res.write(`Name : ${row.name}\nAge: ${row.age}\nDOB: ${dd+'-'+mm+'-'+yyyy}\nEmail: ${row.email}\n\n`);
                            })
                            res.end();
                        } else {
                            res.statusCode = 404;
                            res.end("NO such record(s) with the given ID");
                        }
                    } else if (queryName === "update") {
                        if (result.affectedRows>0) {
                            res.statusCode = 200;
                            res.end("Successfully Updated");
                        } else {
                            res.statusCode = 404;
                            res.end("NO such record(s) with the ID to update");
                        }
                    }
                }
                // at end the connection is released back to the pool
                connection.release();
            })
        }
    })
}
           
// exporting the function
module.exports = createMyConnection;