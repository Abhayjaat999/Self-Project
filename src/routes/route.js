const express = require('express')
const router = express.Router()
const Authorcontroller= require("../controllers/authorcontroller")
const blogcontroller=require("../controllers/blogcontroller")

//////////////  Phase-1  /////////////
router.post("/authors", Authorcontroller.createAuthors  )

router.get("/blogs", blogcontroller.getallBlogs)

router.post("/blogs",blogcontroller.createblogdocument)

router.put("/blogs/:blogId",blogcontroller.updateblog)

<<<<<<< HEAD

=======
router.delete("/blogs/:blogId",blogcontroller.deleteBlogid)
>>>>>>> 899f20f82578c31c66ff6c7efc6b0d9d8a2bda00

module.exports = router;