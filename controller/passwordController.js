const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require('dotenv').config()
const User = require("../src/models/users")


// email config
const transporter = nodemailer.createTransport({
    service: "Yandex",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
})
  
//send email Link For reset Password
const sendPasswordLink =  async (req, res) => {
    const email = req.body.email;
    if (!email) {
      res.status(401).json({ status: 401, message: "Enter Your Email" })
    }
    try {
      const userfind = await User.findOne({ email: email });
      // token generate for reset password
      const token = jwt.sign({ _id: userfind._id }, "keysecret", {
        expiresIn: "1h"
      });
      const setusertoken = await User.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token });
      if (userfind) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Email For password Reset",
          text: `This Link Valid For 1 hour http://localhost:3000/newpassword/${userfind.id}/${setusertoken.verifytoken}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            // console.log("error", error);
            res.status(401).json({ status: 401, message: "email not send" })
          } else {
            // console.log("Email sent", info.response);
            res.status(201).json({ status: 201, message: "Email sent Succsfully" })
          }
        })
      }
    }
    catch (error) {
      res.status(401).json({ status: 401, message: "invalid user" })
    }
  };
  
  //verify user for forgot password time
const verifyUser =  async (req, res) => {
    const { id, token } = req.params;
    try {
      const validuser = await User.findOne({ _id: id });
      const verifyToken = jwt.verify(validuser.verifytoken, "keysecret");
      if (validuser && verifyToken._id) {
        res.status(201).json({ status: 201, validuser })
      } else {
        res.status(401).json({ status: 401, message: "user not exist" })
      }
    } catch (error) {
      res.status(401).json({ status: 401, error })
    }
  };
  
  // change password
const changedPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
      const validuser = await User.findOne({ _id: id });
      const verifyToken = jwt.verify(token, "keysecret");
      // console.log(verifyToken);
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
}
  
module.exports = {sendPasswordLink, verifyUser, changedPassword}