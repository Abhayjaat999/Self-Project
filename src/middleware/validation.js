const { default: mongoose } = require("mongoose")


const validationforbody = async function (req, res, next) {
    // if (req.body) {
    //     if (Object.keys(req.body).length > 0) {
    //         if (req.body.authorId) {
    //             validateobjid = mongoose.Types.ObjectId.isValid(req.body.authorId)
    //             if (!validateobjid) return res.status(400).send({ status: false, msg: "Not a valid id" })
    //         }
    //         return next()
    //     }
    //     return res.status(400).send({ status: false, msg: "please provide details" })
    // }
    // if (req.query) {
    //     if (Object.keys(req.query).length > 0) {
    //         if (req.body.authorId) {
    //             validateobjid = mongoose.Types.ObjectId.isValid(req.body.authorId)
    //             if (!validateobjid) return res.status(400).send({ status: false, msg: "Not a valid id" })
    //         }
    //         return next()
    //     }
    //     return res.status(400).send({ status: false, msg: "please provide details" })
    // }

    if (req.body) {
        if (Object.keys(req.body).length > 0) {

            let id
            if (req.body.authorId) id = req.body.authorId
            if (req.body.blogId) id = req.body.blogId
            validateobjid = mongoose.Types.ObjectId.isValid(id)
            if (!validateobjid) return res.status(400).send({ status: false, msg: "Not a valid id" })

            return next()
        }
        return res.status(400).send({ status: false, msg: "please provide details" })
    }
    if (req.param) {
        if (Object.keys(req.param).length > 0) {

            let id
            if (req.body.authorId) id = req.param.authorId
            if (req.body.blogId) id = req.param.blogId
            validateobjid = mongoose.Types.ObjectId.isValid(id)
            if (!validateobjid) return res.status(400).send({ status: false, msg: "Not a valid id" })

            return next()
        }
        return res.status(400).send({ status: false, msg: "please provide details" })
    }
    if (req.query) {
        if (Object.keys(req.query).length > 0) {

            let id
            if (req.body.authorId) id = req.query.authorId
            if (req.body.blogId) id = req.query.blogId
            validateobjid = mongoose.Types.ObjectId.isValid(id)
            if (!validateobjid) return res.status(400).send({ status: false, msg: "Not a valid id" })

            return next()
        }
        return res.status(400).send({ status: false, msg: "please provide details" })
    }
}

// const checkautid = async (req, res, next) =>
//  {
//     if (!req.body.authorId) return res.status(404).send({ status: false, msg: "authorid is not present" })
//     next()
// }


const jwttoken = require('jsonwebtoken')
const blogmodel = require("../models/blogmodel")
const authenticate = function (req, res, next) {
    // let decodedToken = jwttoken.verify(token, "Blogging-Site")
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
        let decodedToken = jwttoken.verify(token, "Blogging-Site")
        if (!decodedToken) { return res.status(400).send({ status: false, message: "Not a Valid Token" }) }
        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const authorise = async function (req, res, next) {
    try {
        let ObjectID = mongoose.Types.ObjectId
        if (req.query.authorid) {
            let authorId = req.query.authorid
            let token = req.headers['x-api-key']
            if (!ObjectID.isValid(authorId)) { return res.status(400).send({ status: false, message: "Not a valid AuthorID" }) }
            let decodedToken = jwttoken.verify(token, "Blogging-Site")
            if (authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
        if (req.params.blogId) {
            let blogId = req.params.blogId
            let token = req.headers['x-api-key']
            if (!ObjectID.isValid(blogId)) { return res.status(400).send({ status: false, message: "Not a valid BlogID" }) }
            let check = await blogmodel.findById(blogId)
            if (!check) { return res.status(404).send({ status: false, message: "No such blog exists" }) }
            let decodedToken = jwttoken.verify(token, "Blogging-Site")
            if (check.authorId != decodedToken.authorId) {
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
module.exports.validationforbody = validationforbody
// module.exports.checkautid = checkautid