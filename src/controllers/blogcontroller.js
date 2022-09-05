const blogmodel= require("../models/blogmodel")
const autormodel= require("../models/autormodel")

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

module.exports.updateblog=updateblog
module.exports.createblog=createblog