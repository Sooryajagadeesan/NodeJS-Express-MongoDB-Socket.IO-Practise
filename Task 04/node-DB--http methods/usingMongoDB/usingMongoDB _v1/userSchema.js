const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const userSchema = new Schema({
    name:  String,
    age: Number,
    dob: Date,
    email: String,
});

// exporting the Schema as a model
module.exports = mongoose.model("User",userSchema);