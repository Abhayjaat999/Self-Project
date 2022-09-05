const express = require('express')
const router = express.Router()
const blogmodel = require("../controllers/blogcontroller")

const Authorcontroller= require("../controllers/authorcontroller")

router.post("/authors", Authorcontroller.createAuthors  )


router.post("/createblogs",blogmodel.createblogdocument)

module.exports = router;