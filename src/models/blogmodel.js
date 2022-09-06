const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const mixed = mongoose.Schema.Types.Mixed
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body:  {
        type:String,
        required:true
 },
 authorId:  {
    type: ObjectId,
    ref: "Author",
    required:true
},
   tags: [String] ,
   category: {type:String, 
    required:true, 
    enum: ["technology", "entertainment", "life style", "food"," fashion"],
   },
    subcategory: {type:[String], 
    enum:["web development","mobile development","AI","ML"] 
},
isDeleted: {type:Boolean, default: false},
isPublished: {type:Boolean, default: false},
PublishedAt : String

}, { timestamps: true });
module.exports = mongoose.model('Blog', BlogSchema)