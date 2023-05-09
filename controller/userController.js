const User = require("../src/models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../Config/config");
const randomString = require("randomstring");
const fs = require("fs");



//change role
const changeRole = async (req, res) => {
    try {
      const _id = req.params.id;
      const changeRole = await User.findByIdAndUpdate(_id, req.body);
      // console.log(changeRole);
      res.send(changeRole); 
    } catch (e) {
      res.status(500).send(e);
    }
}
  
// get users
const users =  async (req, res) => {
    try {
      const getUsers = await User.find({});
      // console.log(getUsers);
      res.json(getUsers);
    } catch (e) {
      res.status(400).send(e);
    }
}
  
//register user in database
const registerUser =  async (req, res) => {
    try {
      const registerUser = new User(req.body)
      // console.log(registerUser);
      await registerUser.save();
      res.json(registerUser)
    } catch (error) {
      res.status(400).send(error)
    }
}
  
//login user
const login = async (req, res, next) => {
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
        { expiresIn: "10s" }
      );
      res.status(200).json({
        msg: "User Loggedin successfully",
        token: token,
        user: loadedUser,
      });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
};
  
//refresh token 
const refresh = (id) => {
    try {
      const secret_token = config.secret_jwt;
      const newSecretJwt = randomString.generate();
      fs.readFile("Config/config.js", "utf-8", (err, data) => {
        if (err) throw err;
        const newValue = data.replace(
          new RegExp(secret_token, "g"),
          newSecretJwt
        );
        fs.writeFile("Config/config.js", newValue, "utf-8", (err, data) => {
          if (err) throw err;
          console.log(" rewrite token done");
        });
      });
      const token = jwt.sign({ _id: id }, newSecretJwt, {
        expiresIn: "2h",
      });
      return token;
    } catch (error) {
      console.log(error);
      res.status(502).send({ msg: error });
    }
  };
  
 const refreshToken = async (req, res, next) => {
    const _id = req.body._id;
    console.log(req.body);
    try {
      const loadedUser = await User.findOne({ _id: _id });
  
      if (!loadedUser) {
        return res.status(404).send({ msg: "User Not Found" });
      }
  
      // console.log(loadedUser);
      const tokenData =  refresh(loadedUser._id);
      // console.log(tokenData);
  
      res.status(200).json({
        msg: "Token Refreshed successfully",
        token: tokenData,
        user: loadedUser,
      });
    } catch (error) {
      return res.status(501).send({ msg: error });
    }
 };
  
 module.exports = {changeRole, users, registerUser, login, refresh, refreshToken}