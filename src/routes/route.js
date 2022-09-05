const express = require('express')
const router = express.Router()

const Authorcontroller= require("../controllers/authorcontroller")

router.post("/authors", Authorcontroller.createAuthors  )


module.exports = router;