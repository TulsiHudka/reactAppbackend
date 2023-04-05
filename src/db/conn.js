const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tulsihudka:Tuls!4212@cluster0.epjkykc.mongodb.net/test")
    .then(() => {
    console.log("connection sucessful");
    }).catch(() => {
    console.log("no connection");
})