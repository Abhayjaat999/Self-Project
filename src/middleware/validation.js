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

const checkautid = async (req, res, next) =>
 {
    if (!req.body.authorId) return res.status(404).send({ status: false, msg: "authorid is not present" })
    next()
}
module.exports.validationforbody = validationforbody
module.exports.checkautid = checkautid