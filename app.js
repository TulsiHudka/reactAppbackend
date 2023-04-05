const express = require("express");
const Blog = require("./src/models/blogs");
const User = require("./src/models/users");
const app = express();
require('dotenv').config();
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser");
// const auth = require("./middleware/auth");

require("./src/db/conn");
// const port = process.env.PORT || 5000;


const cors = require('cors')

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.get("/blogs", async (req, res) => {
  try {
    const getBlogs = await Blog.find({});
    console.log(getBlogs);
    res.json(getBlogs);
  } catch (e) {
    res.status(400).send(e);
  }
})

//for individual req
app.get("/blogs/:id", async(req, res) => {
  try{
      const _id =  req.params.id;
      const getBlog = await Blog.findById(_id);
      res.send(getBlog);
  }catch(e){
      res.status(400).send(e);
  }
})

//for addBlog 

app.post("/addBlog", async(req, res) => {
  try{
      const addingBlogs = new Blog(req.body);
      const insertBlogs = await addingBlogs.save();
      console.log(insertBlogs);
      res.status(201).send(insertBlogs);
  }catch(e){
      res.status(400).send(e);
  }
})


//for deleting blog

app.delete("/blogs/:id", async(req, res) => {
  try{
      const _id =  req.params.id;
      const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
      res.send(deleteBlog);
  }catch(e){
      res.status(500).send(e);
  }
})

//for editing blog

app.put("/edit/:id", async(req, res) => {
  try{
      const _id =  req.params.id;
      const editBlog = await Blog.findByIdAndUpdate(_id, req.body, {
          new:true
      });
      res.send(editBlog);
  }catch(e){
      res.status(500).send(e);
  }
})


app.get("/users", async (req, res) => {
  try {
    const getUsers = await User.find({});
    console.log(getUsers);
    res.json(getUsers);
  } catch (e) {
    res.status(400).send(e);
  }
})



app.listen(8000, () => {
  console.log(`server is running at `);
})
