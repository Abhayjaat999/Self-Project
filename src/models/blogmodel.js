const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true
    },
    tags: [String],

    category: {
        type: String,
        required: true,

    },
    subcategory: {
        type: [String],

    },
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
   
    deletedAt :{ type :String , default : null},
    PublishedAt: {type :String , default : moment().format("DD/MM/YYYY , h:mm:ss a")}

}, { timestamps: true });
module.exports = mongoose.model('Blog', BlogSchema)