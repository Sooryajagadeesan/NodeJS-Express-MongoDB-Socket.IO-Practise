const dbQueries = require("./services/dbQueries");

// insert data using CALLBACK
function insertUsingCallback(params,callback) {
    return callback(params);
}

// select all data using CALLBACK
function selectUsingCallback(callback) {
    return callback();
}

// insert data using PROMISE
function insertUsingPromise(params) {
    return new Promise((resolve,reject) => {
        resolve(dbQueries.insertIntoDB(params));
    })
}

// select all data using PROMISE
function selectUsingPromise() {
    return new Promise((resolve,reject) => {
        resolve(dbQueries.selectFromDB());
    })
}

// insert data using ASYNC AWAIT
async function insertUsingAsyncAwait(params) {
    let result;
    try {
        result = await dbQueries.insertIntoDB(params);
    }catch(err) {
        result = err;
    }
    return result;
}

// select all data using ASYNC AWAIT
async function selectUsingAsyncAwait() {
    let result;
    try {
        result = await dbQueries.selectFromDB();
    } catch(err) {
        result = err;
    }
    return result;
}

// SELECT AND INSERT data from 1 table to another using PROMISE
function selectandinsertUsingPromise(insertingTable) {
     return new Promise((resolve,reject) => {
         dbQueries.selectFromDB()
        .then((dbResponse) => {
            if (dbResponse.results) {
                if (dbResponse.results.length > 0){
                    dbResponse.results.forEach(data => {
                        let {dob} = data;
                        data["dob"] = (dob.getDate().toString()).padStart(2,'0') + '-' + ((dob.getMonth() +1).toString()).padStart(2,'0') + '-'+ dob.getFullYear();
                        dbQueries.insertIntoDB(data,insertingTable)
                        })
                     resolve({statusCode:200,dbResponse:"All Data Inserted into new Table"});
                }
            }
            let statusCode = dbResponse.statusCode;
            let response = dbResponse.dbResponse;

            resolve({statusCode,dbResponse:response});
        })
        .catch(err => {
            reject(err);
        })
})
}

// SELECT AND INSERT data from 1 table to another using ASYNC AWAIT
async function selectandinsertUsingAsyncAwait(insertingTable) {
    let selectionResult = await dbQueries.selectFromDB();
    let length = 0;
    if (selectionResult.results) length = selectionResult.results.length;
    let response = { 
        statusCode: selectionResult.statusCode,
        dbResponse : selectionResult.dbResponse
    };
    if (length > 0){
        selectionResult.results.forEach(data => {
        let {dob} = data;
        data["dob"] = (dob.getDate().toString()).padStart(2,'0') + '-' + ((dob.getMonth() +1).toString()).padStart(2,'0') + '-'+ dob.getFullYear();
        try {
            dbQueries.insertIntoDB(data,insertingTable);
        } catch(err) {
            return err; // if promise rejected, err is returned
        }
        });
        response = {statusCode:200,dbResponse:"All data inserted into new Table"};
    }
    return response;
}

// exporting all the functions
module.exports = {
    insertUsingCallback,
    selectUsingCallback,
    insertUsingPromise,
    selectUsingPromise,
    insertUsingAsyncAwait,
    selectUsingAsyncAwait,

    selectandinsertUsingPromise,
    selectandinsertUsingAsyncAwait
}