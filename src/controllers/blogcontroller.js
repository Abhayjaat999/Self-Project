const blogmodel = require("../models/blogmodel")
const authormodel = require("../models/authormodel")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')


//Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)

const updateblog = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        let blogDetails = await blogmodel.findById(blogId);
        if (!blogDetails) {
            return res.status(400).send({ status: false, msg: "no such blog is exist" });
        }
        let { title, body, tags, category, subcategory } = req.body;
        // if (title !== null) { blogDetails.title = title }
        // if (body !== null) { blogDetails.body = body }
        // if (tags !== null) { blogDetails.tags = tags }
        // if (category !== null) { blogDetails.category = category }
        // if (subcategory !== null) { blogDetails.subcategory = subcategory }
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
};



const isValid = (val) => {
    if (typeof val === "undefined" || val === "null") return false;
    if (typeof val === "string" && val.trim().length === 0) return false
    return true;
}
const isvalidbody = (val) => {
    return Object.keys(val).length > 0
}


const createblogdocument = async function (req, res) {
    try {

        const createblog = req.body
        const authorid = await authormodel.findById(createblog.authorId)
        const validateid = ObjectId.isValid(createblog.authorId)
        if (!authorid) res.send("authorid is not Present ")
        if (!validateid) res.send("Auther id is not valid")

        const { title, body, authorId, tags, catagory, subcatagory, isDeleted, isPublished } = req.body

        if (!isvalidbody(req.body)) return res.status(400).send({ status: false, msg: "Please provide details" })

        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: "author id is required" })

        if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Auther id is not valid" })

        if (!authorId) res.status(404).send("authorid is not Present ")
        const createbody = await blogmodel.create(req.body)


        res.status(201).send({
            status: true,
            data: createbody
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}
const getallBlogs = async function (req, res) {
    try {

    

        let filterbyid = req.query.authorid
        let filterbycategory = req.query.catagory
        let filterbytags = req.query.tags
        let filterbysubcategory = req.query.subcategory

        if (!ObjectId.isValid(filterbyid)) return res.send({ status: false, msg: "object id is not valid" })

        if (filterbyid && filterbycategory && filterbytags && filterbycategory) {
            let databyfilter = await blogmodel.find({ isDeleted: false } && { published: true } && { authorId: filterbyid } && { category: filterbycategory } && { tags: filterbytags } && { subcategory: filterbysubcategory })
            if (databyfilter == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databyfilter })
        }

        if (filterbyid) {
            let databyid = await blogmodel.find({ isDelete: false } && { published: true } && { authorId: filterbyid })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databyid })
        }
        if (filterbycategory) {
            let databycategory = await blogmodel.find({ isDelete: false } && { published: true } && { category: filterbycategory })
            if (databycategory == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databycategory })
        }
        if (filterbytags) {
            let databytags = await blogmodel.find({ isDelete: false } && { published: true } && { tags: filterbytags })
            if (databytags == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databytags })
        }
        if (filterbysubcategory) {
            let databysubcategory = await blogmodel.find({ isDelete: false } && { published: true } && { subcategory: filterbysubcategory })
            if (databysubcategory == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databysubcategory })
        }

        return res.status(404).send({ status: false, msg: "Data not found" })


    }
    catch (err) {
        res.status(404).send({
            status: false,
            msg: err.message
        })
    }
}


const deleteBlogParam = async function (req, res) {

    // const { title, body, authorId, tags, catagory, subcatagory, isDeleted, isPublished } = req.body

    let filterbyid = req.query.authorid
    let filterbycategory = req.query.category
    let filterbytags = req.query.tags
    let filterbysubcategory = req.query.subcategory
    let filterpublished = req.query.isPublished
    try {
        if (filterbyid && filterbycategory && filterbytags && filterbysubcategory && filterpublished) {
            let filterbydata = await blogmodel.updateMany({ isDelete: false, authorId: filterbyid, category: filterbycategory, tags: filterbytags, subcategory: filterbysubcategory, isPublished: filterpublished }, { $set: { isDeleted: true } }, { new: true })
            return res.status(200).send({ status: true, msg: filterbydata })
        }

        if (filterbyid) {
            if (!ObjectId.isValid(filterbyid)) return res.send({ status: false, msg: "object id is not valid" })
            let databyid = await blogmodel.updateMany({ isDelete: false, authorId: filterbyid }, { $set: { isDeleted: true } }, { new: true })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, msg: databyid })
        }
        if (filterbycategory) {
            let databyid = await blogmodel.updateMany({ isDelete: false, category: filterbycategory }, { $set: { isDeleted: true } }, { new: true })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, msg: databyid })
        }
        if (filterbytags) {
            let databyid = await blogmodel.updateMany({ isDelete: false, tags: filterbytags }, { $set: { isDeleted: true } }, { new: true })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, msg: databyid })
        }
        if (filterbysubcategory) {
            let databyid = await blogmodel.updateMany({ isDelete: false, subcategory: filterbysubcategory }, { $set: { isDeleted: true } }, { new: true })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, msg: databyid })
        }
        if (filterpublished) {

            let databyid = await blogmodel.updateMany({ isDelete: false, isPublished: filterpublished }, { $set: { isDeleted: true } }, { new: true })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, msg: databyid })
        }


    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })

    }
}


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






module.exports.getallBlogs = getallBlogs
module.exports.createblogdocument = createblogdocument
module.exports.updateblog = updateblog
module.exports.createblog = createblog
module.exports.deleteBlogid = deleteBlogid

