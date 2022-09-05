
const blogmodel= require("../models/blogmodel")
const authormodel= require("../models/authormodel")
var ObjectId = require('mongoose').Types.ObjectId

const createblog = async function (req, res) {
   try{
    let data = req.body;
    let savedData = await blogmodel.create(data);
    res.send({ msg: savedData });
   } catch (err) {
    return res.status(500).send({ msg: err.message });
  }};

  const updateblog = async function (req, res) {
    try {
      let blogId = req.params.blogId;
  
      let blogDetails = await blogmodel.findById(blogId);
      if (!blogDetails) {
        return res.status(400).send({ status: false, msg: "no such blog is exist" });
      }
      let blogData = req.body;
      let updateblog = await blogmodel.findOneAndUpdate({ _id: blogId }, blogData, { new: true,});
      res.status(200).send({ status: true, data: updateblog });
    } catch (err) {
      return res.status(500).send({ msg: err.message });
    }
  };


// const blogmodel = require('../models/blogmodel')
// const authormodel = require('../controllers/authorcontroller')


const createblogdocument = async function (req, res) {
    try {
        const createblog = req.body
        const authorid = await authormodel.findbyid(createblog.authorId)
        const validateid = ObjectId.isValid(createblog.authorId)
        if (!authorid) res.send("authorid is not Present ")
        if (!validateid) res.send("Auther id is not valid")
        const createbody = await blogmodel.create(createblog)
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
        let data = await blogmodel.find({ isDelete: false, published: true })
        res.status(200).send({ status: true, msg: data })
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
module.exports.updateblog=updateblog
module.exports.createblog=createblog
