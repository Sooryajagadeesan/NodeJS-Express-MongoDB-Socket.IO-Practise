const mongoose = require("mongoose");
const { Schema } = mongoose;

// defining user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    }
},{ timestamps: true});

// exporting the userSchema as a model
module.exports = mongoose.model("User",userSchema);
