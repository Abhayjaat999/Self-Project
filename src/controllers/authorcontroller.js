const authormodel = require("../models/authormodel")
const validfun = require("../validationfunction/validfun")
// =====================================||CREATE AUTHORS||===========================================================

const createAuthors = async function (req, res) {
    try {
        let { email, password, title, fname, lname } = req.body


        if (!fname) return res.send({ status: false, msg: "fname is required" })
        if (!lname) return res.send({ status: false, msg: "lname is required" })
        if (!title) return res.send({ status: false, msg: "title is required" })
        if (!email) return res.send({ status: false, msg: "email is required" })
        if (!password) return res.send({ status: false, msg: "password is required" })

        let findemail = await authormodel.find({ email: email, password: password })
        if (findemail.length > 0) return res.send({ status: false, msg: "User already exists" })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            return res.status(400).send({ msg: "email is invalid", status: false })

        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password))
            return res.status(400).send({ msg: "Password is invalid", status: false })

        if (!validfun.isValidTitle(title, ["Mr", "Mrs", "Miss"])) {
            return res.status(400).send({
                    status: false,
                    message: `Title should be among Mr, Mrs, Miss`,
                });
        }


        let savedData = await authormodel.create(req.body)
        res.send({ msg: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
// =======================================================================================================

module.exports.createAuthors = createAuthors