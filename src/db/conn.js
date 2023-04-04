const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tulsihudka:Tuls!4212@cluster0.epjkykc.mongodb.net/test")
  .then(() => {
    console.log("Connection Succesful");
  }).catch(() => {
    console.log("No Connection");
  });