const blogmodel = require("../models/blogmodel")
const moment = require('moment')
const { default: mongoose } = require("mongoose")

// ===============================||CREATE BLOG||================================================
const createblogdocument = async function (req, res) {
    try {
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
        if(!blogId) return res.send("blogId is required")
        validateobjid = mongoose.Types.ObjectId.isValid(blogId)
        if(!validateobjid) return res.send("invalid blog id")
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

        if (authorid) { obj.authorId = authorid }
        if (catagory) { obj.catagory = catagory }
        if (tags) { obj.tags = { $in: [tags] } }
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

        let obj = { isDeleted: false, }

        if (authorid) { obj.authorId = authorid }
        if (category) { obj.category = category }
        if (isPublished) { obj.isPublished = isPublished }
        if (tags) { obj.tags = { $in: [tags] } }
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



module.exports.getallBlogs = getallBlogs
module.exports.createblogdocument = createblogdocument
module.exports.updateblog = updateblog
module.exports.deleteBlogid = deleteBlogid
module.exports.deleteBlogParam = deleteBlogParam


