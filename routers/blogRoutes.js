const express = require("express")
const auth = require("../middleware/auth");
const { upload } = require('../middleware/uploadImage')
const router = new express.Router()

const { blogs, blogPost, addBlog, deleteBlog, editBlog , uploads} = require("../controller/blogController")

router.get("/blogs", blogs)
router.get("/blogs/:id", auth, upload, blogPost)
router.post("/addBlog", auth, upload, addBlog)
router.delete("/blogs/:id", auth, upload, deleteBlog)
router.put("/edit/:id", auth, upload, editBlog)

module.exports = router
