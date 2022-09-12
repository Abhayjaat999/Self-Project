const express = require('express')
const router = express.Router()
const Authorcontroller = require("../controllers/authorcontroller")
const blogcontroller = require("../controllers/blogcontroller")
const middleware = require("../middleware/validation")


// CREATE AUTHER
router.post("/authors", Authorcontroller.createAuthors)


// GET BLOGS BY FILTER
router.get("/blogs", middleware.authenticate,blogcontroller.getallBlogs)


//CREATE BLOG
router.post("/blogs", middleware.authenticate, middleware.authorise, blogcontroller.createblogdocument)


// UPDATE BLOG
router.put("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogcontroller.updateblog)


//DELETE BLOGS BY FILTER
router.delete("/blogs", middleware.authenticate,  blogcontroller.deleteBlogParam)

//LOGIN BY CRINDENTIALS
router.post("/login", blogcontroller.loginUser)

//DELETE BLOG BY ID
router.delete("/blogs/:blogId", middleware.authenticate,blogcontroller.deleteBlogid)

router.all("/*", (req, res) => { res.status(404).send({ status: false, message: "Endpoint is not correct" }) })

module.exports = router;