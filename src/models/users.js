const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    verifytoken: {
        type: String
    }

});

const User = new mongoose.model("User", userSchema);

module.exports = User;