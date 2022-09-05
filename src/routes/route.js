const express = require('express')
const router = express.Router()
const blogmodel = require("../controllers/blogcontroller")


router.post("/createblogs",blogmodel.createblogdocument)

module.exports = router;