require('dotenv').config();
const express = require("express");
const multer = require("multer")
const app = express();
require('dotenv').config();
const cookieParser = require("cookie-parser");
const config = require("./Config/config");
const blogRouter = require("./routers/blogRoutes")
const userRouter = require("./routers/userRoutes")
const passwordRouter = require("./routers/passwordRoutes")
require("./src/db/conn");
const cors = require('cors')
const eurekaHelper = require('./eureka-helper');
// const express = require('express');
// const app = express();
// const eurekaHelper = require('./eureka-helper');
const PORT = 9000;

// app.listen(PORT, () => {
//   console.log("user-service on 6000");
// })

// app.get('/', (req, res) => {
//   res.json("I am user-service")
// })
eurekaHelper.registerWithEureka('user-management', PORT);


// eurekaHelper.registerWithEureka('user-service', PORT);



app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use("/")
app.use("/uploads", express.static("uploads"));
app.use("/blogs", blogRouter)
app.use("/users", userRouter)
app.use("/password", passwordRouter)

app.listen(5000, () => {
  console.log(`server is running at `);
})
