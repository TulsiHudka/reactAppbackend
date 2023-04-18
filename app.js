require('dotenv').config();
const express = require("express");
const Blog = require("./src/models/blogs");
const User = require("./src/models/users");
const multer = require("multer")
const nodemailer = require("nodemailer")
const app = express();
require('dotenv').config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const auth = require("./src/middleware/auth");

require("./src/db/conn");
// const port = process.env.PORT || 5000;


const cors = require('cors')


// email config

const transporter = nodemailer.createTransport({
  service: "Yandex",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})


//multer

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })
}).single("url");



app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));


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
app.get("/blogs/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const getBlog = await Blog.findById(_id);
    res.send(getBlog);
  } catch (e) {
    res.status(400).send(e);
  }
})

//for addBlog 

app.post("/addBlog", upload, auth, async (req, res) => {
  try {
    console.log(req.file.filename);
    const addBlog = {
      title: req.body.title,
      url: req.file.filename,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
      admin: req.body.admin
    }
    const addingBlogs = new Blog(addBlog);
    const insertBlogs = await addingBlogs.save();
    console.log(addingBlogs);
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

app.put("/edit/:id", upload, auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const addBlog = {
      title: req.body.title,
      url: req.file.filename,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
      admin: req.body.admin
    }
    const editBlog = await Blog.findByIdAndUpdate(_id, addBlog, {
      new: true
    });
    console.log(editBlog);
    res.send(editBlog);
  } catch (e) {
    res.status(500).send(e);
  }
})

//change role
app.put("/users/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const changeRole = await User.findByIdAndUpdate(_id, req.body);
    console.log(changeRole);
    res.send(changeRole);
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


//file upload

app.post("/upload", upload, (req, res) => {

  res.send("file upload")
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

    // console.log(token);

    res.status(200).json({
      msg: "User Loggedin successfully",
      token: token,
      user: loadedUser,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});


//send email Link For reset Password

app.post("/sendpasswordlink", async (req, res) => {

  const email = req.body.email;
  // console.log(email)


  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" })
  }

  try {
    const userfind = await User.findOne({ email: email });



    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, "keysecret", {
      expiresIn: "1h"
    });
    // console.log(token);

    const setusertoken = await User.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token });

    // console.log(setusertoken.verifytoken);



    if (userfind) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 1 hour http://localhost:3000/newpassword/${userfind.id}/${setusertoken.verifytoken}`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: "email not send" })
        } else {
          console.log("Email sent", info.response);
          res.status(201).json({ status: 201, message: "Email sent Succsfully" })
        }
      })


    }
  }
  catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" })
  }

});



//verify user for forgot password time
app.post("/verifytoken/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  // console.log(id, token);
  try {
    // const userfind = await User.findOne({ _id: id });
    const validuser = await User.findOne({ _id: id });
    // console.log(validuser);

    const verifyToken = jwt.verify(validuser.verifytoken, "keysecret");
    // console.log(verifyToken._id);


    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser })
    } else {
      res.status(401).json({ status: 401, message: "user not exist" })
    }

  } catch (error) {
    res.status(401).json({ status: 401, error })
  }
});
// console.log(validuser);
// console.log(verifyToken)


// change password

app.post("/changedPassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  // console.log(req.body);

  // console.log(id, password, token);

  try {
    const validuser = await User.findOne({ _id: id });
    // console.log(validuser);

    const verifyToken = jwt.verify(token, "keysecret");
    console.log(verifyToken);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await User.findByIdAndUpdate({ _id: id }, { password: newpassword });

      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass })

    } else {
      res.status(401).json({ status: 401, message: "user not exist" })
    }
  } catch (error) {
    res.status(401).json({ status: 401, error })
  }
})


app.listen(8000, () => {
  console.log(`server is running at `);
})


