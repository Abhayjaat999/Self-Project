const express = require('express')
const router = express.Router()
const Authorcontroller = require("../controllers/authorcontroller")
const blogcontroller = require("../controllers/blogcontroller")
const middleware = require("../middleware/validation")


// CREATE AUTHER
router.post("/authors", middleware.checkautid, Authorcontroller.createAuthors) 


// GET BLOGS BY FILTER
router.get("/blogs", middleware.validationforbody, blogcontroller.getallBlogs) 


//CREATE BLOG
router.post("/blogs", middleware.checkautid ,middleware.validationforbody, blogcontroller.createblogdocument)


// UPDATE BLOG
router.put("/blogs/:blogId", middleware.validationforbody, blogcontroller.updateblog)


//DELETE BLOGS BY FILTER
router.delete("/blogs", middleware.validationforbody, blogcontroller.deleteBlogParam)


//DELETE BLOG BY ID
router.delete("/blogs/:blogId", middleware.validationforbody, blogcontroller.deleteBlogid)


module.exports = router;