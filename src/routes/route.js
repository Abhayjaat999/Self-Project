const express = require('express')
const router = express.Router()
const blogmodel = require("../controllers/blogcontroller")

const Authorcontroller= require("../controllers/authorcontroller")
const getController=require("../controllers/blogcontroller")
router.post("/authors", Authorcontroller.createAuthors  )
router.get("/getallBlogs", getController.getallBlogs)

router.post("/createblogs",blogmodel.createblogdocument)

module.exports = router;