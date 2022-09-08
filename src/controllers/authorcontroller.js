const authormodel = require("../models/authormodel")
const validator = require("../utils/validator");
// =====================================||CREATE AUTHORS||===========================================================

const createAuthors = async function (req, res) {
    try {
        if (!validator.isValidTitle(title)) {
            return res
              .status(400)
              .send({
                status: false,
                message: `Title must be  Mr, Mrs, Miss `,
              });
          }

        let data = req.body
        let savedData = await authormodel.create(data)
        res.send({ msg: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
// =======================================================================================================

module.exports.createAuthors = createAuthors