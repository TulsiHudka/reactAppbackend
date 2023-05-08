const Blog = require("../src/models/blogs")
const fs = require("fs")

//for all blogs
const blogs =  async (req, res) => {
    try {
      const getBlogs = await Blog.find({});
      // console.log(getBlogs);
      res.json(getBlogs);
    } catch (e) {
      res.status(400).send(e);
    }
}
  
//for individual blog
const blogPost =  async (req, res) => {
    try {
      const _id = req.params.id;
      // console.log(_id);
      const getBlog = await Blog.findById(_id);
      console.log(getBlog);
      res.send(getBlog);
    } catch (e) {
      res.status(400).send(e);
    }
}
  

//add blog
const addBlog =  async (req, res) => {
    try {
      // console.log(req.file.filename);
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
      // console.log(addingBlogs);
      res.status(201).send(insertBlogs);
    } catch (e) {
      res.status(400).send(e);
    }
}
  
// delete bolg
const deleteBlog =  async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
      res.send(deleteBlog);
    } catch (e) {
      res.status(500).send(e);
    }
}
  
//edit blog

const editBlog = async (req, res) => {
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
}
  
module.exports = { blogs, blogPost, addBlog, deleteBlog, editBlog }
  