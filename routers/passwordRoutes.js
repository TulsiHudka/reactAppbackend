const express = require("express")
const router = new express.Router()

const { sendPasswordLink, verifyUser, changedPassword } = require('../controller/passwordController')

router.post("/sendpasswordlink", sendPasswordLink)
router.get("/verifytoken/:id/:token", verifyUser)
router.put("/changedPassword/:id/:token", changedPassword)

module.exports = router;