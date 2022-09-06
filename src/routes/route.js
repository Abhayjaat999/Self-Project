const express = require('express')
const router = express.Router()
const Authorcontroller= require("../controllers/authorcontroller")
const blogcontroller=require("../controllers/blogcontroller")

//////////////  Phase-1  /////////////
router.post("/authors", Authorcontroller.createAuthors  )

router.get("/blogs", blogcontroller.getallBlogs)

router.post("/blogs",blogcontroller.createblogdocument)

router.put("/blogs/:blogId",blogcontroller.updateblog)



module.exports = router;