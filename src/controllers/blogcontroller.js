const blogmodel = require("../models/blogmodel")
const authormodel = require("../models/authormodel")
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')


const createblog = async function (req, res) {
    try {
        let data = req.body;
        let savedData = await blogmodel.create(data);
        res.send({ msg: savedData });
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};

const updateblog = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        let blogDetails = await blogmodel.findById(blogId);
        if (!blogDetails) {
            return res.status(400).send({ status: false, msg: "no such blog is exist" });
        }
        let blogData = req.body;
        let updateblog = await blogmodel.findOneAndUpdate({ _id: blogId }, blogData, { isPublished: true }, { new: true, }, { publishedAt: moment().format("DD/MM/YYYY , h:mm:ss a") }, { upsert: true });
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
        const { title, body, authorId, tags, catagory, subcatagory, isDeleted, isPublished } = req.body

        if (!isvalidbody(req.body)) return res.status(400).send({ status: false, msg: "Please provide details" })

        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: "author id is required" })

        if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Auther id is not valid" })
        const authorid = await authormodel.findById(authorId)
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

        if (filterbyid) {
            if (!ObjectId.isValid(filterbyid)) return res.send({ status: false, msg: "object id is not valid" })
            let databyid = await blogmodel.find({ isDelete: false } && { published: true } && { authorId: filterbyid })
            if (databyid == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databyid })
        }
        if (filterbycategory) {
            let databycategory = await blogmodel.find({ isDelete: false } && { published: true } && { category: filterbycategory })
            if (!databycategory == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databycategory })
        }
        if (filterbytags) {
            let databytags = await blogmodel.find({ isDelete: false } && { published: true } && { tags: filterbytags })
            if (!databytags == []) return res.send({ status: false, msg: "data not found" })
            return res.status(200).send({ status: true, data: databytags })
        }
        if (filterbysubcategory) {
            let databysubcategory = await blogmodel.find({ isDelete: false } && { published: true } && { subcategory: filterbysubcategory })
            if (!databysubcategory == []) return res.send({ status: false, msg: "data not found" })
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
module.exports.getallBlogs = getallBlogs
module.exports.createblogdocument = createblogdocument
module.exports.updateblog = updateblog
module.exports.createblog = createblog
