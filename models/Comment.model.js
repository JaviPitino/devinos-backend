const { Schema, model } = require("mongoose")

const commentSchema = new Schema({

  comment: {
    type: String
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  commentUser: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  wineId: {
    type: Schema.Types.ObjectId,
    ref: "wine"
  },
  createdAt : {
    type: Date,
    default: new Date()
  }
}
)

const CommentModel = model("comment", commentSchema)

module.exports = CommentModel