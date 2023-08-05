const mongoose = require("mongoose");
const Blog=require('./blog')
const User=require('./user')


const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Blog",
    },
    createdBy: {
      type:mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model('Comment',commentSchema);
