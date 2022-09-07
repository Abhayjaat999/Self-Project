const express = require('express')
const router = express.Router()
const Authorcontroller = require("../controllers/authorcontroller")
const blogcontroller = require("../controllers/blogcontroller")
const middleware = require("../middleware/validation")

// CREATE AUTHER
router.post("/authors", Authorcontroller.createAuthors)


// GET BLOGS BY FILTER
router.get("/blogs", middleware.authenticate, middleware.authorise, blogcontroller.getallBlogs)


//CREATE BLOG
router.post("/blogs", blogcontroller.createblogdocument)


// UPDATE BLOG
router.put("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogcontroller.updateblog)


//DELETE BLOGS BY FILTER
router.delete("/blogs", middleware.authenticate, middleware.authorise, blogcontroller.deleteBlogParam)

router.post("/login", blogcontroller.loginUser)


//DELETE BLOG BY ID

router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogcontroller.deleteBlogid)


module.exports = router;