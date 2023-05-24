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

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/blogs", blogRouter)
app.use("/users", userRouter)
app.use("/password", passwordRouter)

app.listen(8000, () => {
  console.log(`server is running at `);
})


