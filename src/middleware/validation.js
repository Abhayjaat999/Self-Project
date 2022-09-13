const { default: mongoose } = require("mongoose")
const jwttoken = require('jsonwebtoken')
const blogmodel = require("../models/blogmodel")
const ObjectID = mongoose.Types.ObjectID

const authenticate = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }

        jwttoken.verify(token, "Blogging-Site", (error, decodedToken) => {
            if (error) {
                if (error.message == "invalid token") return res.status(401).send({ status: false, msg: "token is not valid" })
                return res.status(403).send({ status: false, msg: "incorrect token format" })
            }
            req.decodedToken = decodedToken
        })
        return next();
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const authorise = async function (req, res, next) {
    try {
        let ObjectID = mongoose.Types.ObjectId
        if (req.query.authorid) {
            let authorId = req.query.authorid
            if (!ObjectID.isValid(authorId)) { return res.status(401).send({ status: false, message: "Not a valid AuthorID" }) }
            if (authorId !== req.decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }

            return next()
        }
        if (req.params.blogId) {
            let blogId = req.params.blogId

            if (!ObjectID.isValid(blogId)) { return res.status(401).send({ status: false, message: "Not a valid BlogID" }) }
            let check = await blogmodel.findById(blogId)
            if (!check) { return res.status(404).send({ status: false, message: "No such blog exists" }) }

            if (check.authorId != req.decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.authenticate = authenticate
module.exports.authorise = authorise

