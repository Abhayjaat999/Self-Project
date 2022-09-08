const blogmodel = require("../models/blogmodel")
const moment = require('moment')
const { default: mongoose } = require("mongoose")
const authormodel = require("../models/authormodel")
const jwt = require("jsonwebtoken")
const validfun = require("../validationfunction/validfun")
const ObjectId = mongoose.Schema.Types.ObjectId

// ===============================||CREATE BLOG||================================================
const createblogdocument = async function (req, res) {
    try {
        let { title, body, authorId, tags, category, subcategory, isPublished, isDeleted } = req.body

        if (!title) return res.send({ status: false, msg: "title is required" })
        if (!body) return res.send({ status: false, msg: "body is required" })
        if (!authorId) return res.send({ status: false, msg: "authorId is required" })
        if (!category) return res.send({ status: false, msg: "category is required" })

        if (typeof (title) !== "string") return res.send({ status: false, msg: "title must be string" })
        if (typeof (body) !== "string") return res.send({ status: false, msg: "body must be string" })
        if (typeof (category) !== "string") return res.send({ status: false, msg: "catagory must be string" })


        if (isDeleted) {
            if (typeof (isDeleted) !== "boolean")
                return res.send({ status: false, msg: "is isDeleted must be boolean" })
        }
        let a = typeof (isPublished)
        if (isPublished) {
            if (a !== "boolean")
                return res.send({ status: false, msg: "is Published must be boolean" })
        }

        let checkauthid = await authormodel.findById(authorId)
        if (!checkauthid) return res.send({ status: false, msg: "Auther id is not valid" })

        const createbody = await blogmodel.create(req.body)
        res.status(201).send({ status: true, data: createbody })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
// ====================================================================================================


// ===============================||UPDATE BLOG||=========================================================

const updateblog = async function (req, res) {
    try {

        let blogId = req.params.blogId;
        if (!blogId) return res.send("blogId is required")
        let blogDetails = await blogmodel.findById(blogId);
        if (!blogDetails) {
            return res.status(400).send({ status: false, msg: "no such blog is exist" });
        }

        validateobjid = mongoose.Types.ObjectId.isValid(blogId)
        let { title, body, tags, category, subcategory } = req.body;


        let obj = {}
        let convertobjinarr = {}
        if (title !== null) { obj.title = title }
        if (body !== null) { obj.body = body }
        if (category !== null) { obj.category = category }
        if (tags !== null) { convertobjinarr.tags = tags }
        if (subcategory !== null) { convertobjinarr.subcategory = subcategory }


        let updateblog = await blogmodel.findOneAndUpdate({ _id: blogId }, { $set: obj, $push: convertobjinarr, isPublished: true, PublishedAt: moment().format("DD/MM/YYYY , h:mm:ss a") }, { upsert: true, new: true })
        if (updateblog.isDeleted == true) return res.status(404).send({ status: false, data: "data not found" })
        res.status(200).send({ status: true, data: updateblog });
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
}
// =======================================================================================================


// ===============================||GET ALL BLOGS BY FILTER||=========================================================

const getallBlogs = async function (req, res) {
    try {
        let obj = { isDeleted: false, isPublished: true }
        let { authorid, catagory, tags, subcategory } = req.query

        if (authorid) { obj.authorid = authorid }
        if (catagory) { obj.catagory = catagory }
        if (tags) { obj.tags = tags }
        if (subcategory) { obj.subcatagory = { $in: [subcategory] } }

        let savedData = await blogmodel.find(obj)
        if (savedData.length == 0) {
            return res.status(404).send({ status: false, msg: "no document found" })
        }
        return res.status(404).send({ status: true, msg: savedData })
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}
// ==========================================================================================================

// ===============================||DELETE BLOG BY FILTER||===========================================================

const deleteBlogParam = async function (req, res) {
    try {

        let { authorid, category, tags, subcategory, isPublished } = req.query
        if (!validfun.validation.checkquery(req.query)) return res.status(400).send({ status: false, message: "Data must be present" })
        let obj = { isDeleted: false, }

        if (authorid) { obj.authorid = authorid }
        if (category) { obj.category = category }
        if (isPublished) { obj.isPublished = isPublished }
        if (tags) { obj.tags = tags }
        console.log(obj)
        if (subcategory) { obj.subcatagory = { $in: [subcategory] } }

        let updateddata = await blogmodel.updateMany(obj, { isDeleted: true }, { new: true })
        if (updateddata.modifiedCount == 0) {
            return res.status(404).send({ status: false, msg: "no document found" })
        }
        return res.status(404).send({ status: true, msg: updateddata })
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}
// =======================================================================================================


// =============================================||DELETE BLOG BY BLOG ID||===========================================================

const deleteBlogid = async function (req, res) {

    try {
        let id = req.params.blogId;
        let Blog = await blogmodel.findOne({ _id: id });
        if (!Blog) {
            return res.status(400).send({ status: false, msg: "No such blog found" });
        }

        if (Blog.isDeleted == false) {
            let Update = await blogmodel.findOneAndUpdate(
                { _id: id },
                { isDeleted: true, deletedAt: moment().format("DD/MM/YYYY , h:mm:ss a") },
                { new: true }
            );
            return res.status(400).send({ status: true, msg: Update });

        }
    }
    catch (err) {
        res.status(404).send({
            status: false,
            msg: err.message
        })
    }
}
// =========================================================================================================
const loginUser = async function (req, res) {

    try {

        let { email, password } = req.body
        if (!validfun.validation.checkbody(req.body)) return res.status(400).send({ status: false, message: "Data must be present" })
        if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
        if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
        let authorCheck = await authormodel.findOne({ email: email, password: password });
        if (!authorCheck) return res.status(400).send({ status: false, message: "EmailId or password is incorrect" })
        let token = jwt.sign(
            {
                authorId: authorCheck._id.toString(),
                batch: "Plutonium/cohert",
                organisation: "Project-1"
            },
            "Blogging-Site"
        );
        return res.status(201).send({ status: true, message: token })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.getallBlogs = getallBlogs
module.exports.createblogdocument = createblogdocument
module.exports.updateblog = updateblog
module.exports.deleteBlogid = deleteBlogid
module.exports.deleteBlogParam = deleteBlogParam
module.exports.loginUser = loginUser


