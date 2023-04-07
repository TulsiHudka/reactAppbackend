const express = require("express");
const Blog = require("./src/models/blogs");
const User = require("./src/models/users");
const app = express();
require('dotenv').config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const auth = require("./src/middleware/auth");

require("./src/db/conn");
// const port = process.env.PORT || 5000;


const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/blogs", async (req, res) => {
  try {
    const getBlogs = await Blog.find({});
    // console.log(getBlogs);
    res.json(getBlogs);
  } catch (e) {
    res.status(400).send(e);
  }
})

//for individual req
app.get("/blogs/:id",auth , async (req, res) => {
  try {
    const _id = req.params.id;
    const getBlog = await Blog.findById(_id);
    res.send(getBlog);
  } catch (e) {
    res.status(400).send(e);
  }
})

//for addBlog 

app.post("/addBlog", auth, async (req, res) => {
  try {
    const addingBlogs = new Blog(req.body);
    const insertBlogs = await addingBlogs.save();
    // console.log(insertBlogs);
    res.status(201).send(insertBlogs);
  } catch (e) {
    res.status(400).send(e);
  }
})


//for deleting blog

app.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
    res.send(deleteBlog);
  } catch (e) {
    res.status(500).send(e);
  }
})

//for editing blog

app.put("/edit/:id", auth,async (req, res) => {
  try {
    const _id = req.params.id;
    const editBlog = await Blog.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    console.log(editBlog);
    res.send(editBlog);
  } catch (e) {
    res.status(500).send(e);
  }
})


app.put("/users/:id", auth,async (req, res) => {
  try {
    const _id = req.params.id;
    const editBlog = await Blog.findByIdAndUpdate(_id, req.body);
    console.log(editBlog);
    res.send(editBlog);
  } catch (e) {
    res.status(500).send(e);
  }
})

// get users

app.get("/users", auth, async (req, res) => {
  try {
    const getUsers = await User.find({});
    // console.log(getUsers);
    res.json(getUsers);
  } catch (e) {
    res.status(400).send(e);
  }
})

//register user in database
app.post("/register", async (req, res) => {
  try {
    const registerUser = new User(req.body)
    console.log(registerUser);
    await registerUser.save();
    res.json(registerUser)
  } catch (error) {
    res.status(400).send(error)
  }
})

//login user


app.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    if (password !== loadedUser.password) {
      return res.status(400).send({ msg: "Invalid Credential" });
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    console.log(token);

    res.status(200).json({
      msg: "User Loggedin successfully",
      token: token,
      user: loadedUser,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

app.listen(8000, () => {
  console.log(`server is running at `);
})
