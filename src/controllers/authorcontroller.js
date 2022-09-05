const authormodel = require("../models/authormodel")




const createAuthors = async function (req, res) {
    let data= req.body

    let savedData= await authormodel.create(data)
    res.send({msg: savedData})
}


module.exports.createAuthors = createAuthors