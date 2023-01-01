const mysql = require("mysql");
const myValidator = require("./paramsValidator");

// create a pool of 10 connections,
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "soorya18",
    database: "node_DB_exercise"
})

// creates a connection, query the DB and returns the DB response
function createDBConnection(queryName,sqlQuery,params={}) {
    let dbResponse = "";
    let statusCode = 200;
    return new Promise((resolve,reject) => {
        // connect to DB
        pool.getConnection((err,connection) => {
            if(err) {
                statusCode = 500;
                dbResponse = err;
                reject({statusCode,dbResponse});
            } else {
                if(queryName === "insert") {
                    const validationResult = myValidator(params);
                    if (validationResult !== true) {
                        statusCode = validationResult[0];
                        dbResponse = validationResult[1];
                        reject({statusCode,dbResponse});
                    } else {
                        let {dob} = params;
                        dob = dob.split('-').reverse().join('-');
                        sqlQuery.values[1] = [[params.name,dob,params.email,params.city]]    
                    }
                }
                // start querying
                connection.query(sqlQuery,(err,results) => {
                    if(err) {
                        statusCode = 500;
                        dbResponse = err;
                        reject({statusCode,dbResponse});
                    } else {
                        if(queryName === "insert") {
                            dbResponse = `Insertion Successful\nAffected Rows : ${results.affectedRows}`;
                            resolve({statusCode,dbResponse});
                        } else if(queryName === "select") {
                            if(results.length > 0) {
                                results.forEach(row => {
                                    let dob = row.dob;
                                    let dd = dob.getDate();
                                    let mm = dob.getMonth() + 1;
                                    let yyyy = dob.getFullYear();
                                    dbResponse += `ID : ${row.id}\nName : ${row.name}\nDOB : ${dd+'-'+mm+'-'+yyyy}\nEmail : ${row.email}\nCity : ${row.city}\n\n`;
                                })
                                resolve({statusCode,dbResponse,results});
                            } else {
                                statusCode = 404;
                                dbResponse = "No Record(s)";
                                resolve({statusCode,dbResponse});
                            }
                        }
                    }
                })
                connection.release();
            }
        })
    })
}

// export the createDBConnection function
module.exports = createDBConnection;