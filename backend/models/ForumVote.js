import mongoose from "mongoose";

const forumVoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentType: {
    type: String,
    enum: ["post", "comment"],
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "contentType",
  },
  voteType: {
    type: String,
    enum: ["like", "dislike", "upvote", "downvote"], // Include old values for backward compatibility
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only vote once per content
forumVoteSchema.index(
  { user: 1, contentType: 1, contentId: 1 },
  { unique: true }
);

const ForumVote = mongoose.model("ForumVote", forumVoteSchema);

export default ForumVote;
