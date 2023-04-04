const express = require("express");
const Blog = require("./src/models/blogs");
const app = express();
require("./src/db/conn");
// const port = process.env.PORT || 5000;


// const cors = require('cors')

// app.use(cors());

app.use(express.json());

app.get("/blogs", async (req, res) => {
  try {
    const getBlogs = await Blog.find({});
    console.log(getBlogs);
    res.json({ data: getBlogs });
  } catch (e) {
    res.status(400).send(e);
  }
})


app.listen(5000, () => {
  console.log(`server is running at `);
})
