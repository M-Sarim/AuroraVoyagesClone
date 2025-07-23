import mongoose from "mongoose";

const forumCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumPost",
    required: true,
  },
  images: [String],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumComment",
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumComment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
forumCommentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ForumComment = mongoose.model("ForumComment", forumCommentSchema);

export default ForumComment;
