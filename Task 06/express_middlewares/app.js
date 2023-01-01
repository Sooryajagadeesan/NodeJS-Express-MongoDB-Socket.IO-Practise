const mongoose = require("mongoose");
const express = require("express");
const userRoute = require("./routes/insertUser"); // insertuser route definition
const fileRoute = require("./routes/files"); // upload file route definition
require('dotenv').config(); // to access environment variables placed in .env file

const PORT = process.env.PORT || 5000; // actual port number is stored in .env file, 5000 is alternate port number
// connection to DB
async function createDBConnection() {
    return await mongoose.connect("mongodb://localhost:27017/express_exercise");
}

createDBConnection()
    .then(()=> console.log("DB Connected"))
    .catch((err)=> console.log(`Something went wrong with DB connection.\n${err}`));

// creating a server
const app = express();

// using the middleware exported from routes directory
app.use("/user",userRoute); // prefixing all user routes with /user
app.use("/files",fileRoute); // prefixing all file routes with /files

// listening
app.listen(PORT,()=>console.log(`Server is running at port ${PORT || 5000}`));

