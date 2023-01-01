const mongodb = require("mongodb");
const { collection } = require("./userSchema");
const mongoose = require('mongoose');

// to store the state of DB connection
let isDBConnected = false;

// connect to DB
mongoose.connect('mongodb://localhost:27017/node_DB_exercise01', {maxPoolSize:5})
    .then(()=> {
        console.log("DB Connected");
        isDBConnected = true;
    })
    .catch(err => {
        console.log(`Error while connecting to DB.\n${err}`);
        isDBConnected = false;
    })


// insert into DB
async function insertIntoDB(res,name,age,dob,email) {
    //  if DB is not connected
    if (! isDBConnected){
        res.statusCode = 500;
        res.end("Error while connecting to DB");
        return;
    }

    const status = await collection.insertOne({
        name,
        age,
        dob,
        email
    })
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(`Successfully Inserted, Insert ID : ${status.insertedId}`);
}

// get details by ID
async function getDetailsByID(res,id) {
    //  if DB is not connected
    if (! isDBConnected){
        res.statusCode = 500;
        res.end("Error while connecting to DB");
        return;
    }
    const result = await collection.find({
        _id:  new mongodb.ObjectId(id)
    })

    if (await result.count() === 0) {
        // res.statusCode = 404;
        res.writeHead(404,{"Content-Type":"text/html"});
        res.end("No Such Record");
    } else {
        await result.forEach( document => {
            res.statusCode = 200;
            res.end(JSON.stringify(document) + '\n');
        })
    }
}

// update email by ID
async function updateEmailByID(res,id,newEmail) {
    //  if DB is not connected
    if (! isDBConnected){
        res.statusCode = 500;
        res.end("Error while connecting to DB");
        return;
    }

    const criteria = {
        _id : new mongodb.ObjectId(id)
    }
    const updateDocument = {
        $set : {
            email : newEmail
        }
    }
    const update = await collection.updateOne(criteria,updateDocument);
    const {matchedCount,modifiedCount} = update;
    
    if (matchedCount > 0) {
        if (modifiedCount > 0) {
            res.statusCode = 200;
            res.end("Successfully Updated");
        } else {
            res.statusCode = 200;
            res.end("Already Updated");
        }
    } else {
        res.statusCode = 404;
        res.end("No matched records to update");
    }
}

// select all data
async function selectAll(res) {
    //  if DB is not connected
    if (! isDBConnected){
        res.statusCode = 500;
        res.end("Error while connecting to DB");
        return;
    }

    const result = await collection.find({}).project(
        {
            name:1,
            age:1,
            dob:1,
            email:1        
        })

    if (await result.count() === 0) {
        res.statusCode = 404;
        res.end("No records");
    } else {
        await result.forEach(document => {
            res.write(JSON.stringify(document) + '\n');
        })
        res.statusCode = 200;
        res.end();
    }
}

module.exports = {
    insertIntoDB,
    getDetailsByID,
    updateEmailByID,
    selectAll
}