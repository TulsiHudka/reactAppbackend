const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth");

const {changeRole, users, registerUsre, login, refresh, refreshToken} = require("../controller/userController")

router.put("/users/:id", auth, changeRole )
router.get("/users", auth, users )
router.post("/register", registerUsre )
router.put("/login", login )
router.post("/refresh-token", refreshToken)

module.exports = router
