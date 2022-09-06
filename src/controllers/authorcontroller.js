const authormodel = require("../models/authormodel")


const createAuthors = async function (req, res) {
    try {
        let data = req.body
        let savedData = await authormodel.create(data)
        res.status(200).send({ msg: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createAuthors = createAuthors