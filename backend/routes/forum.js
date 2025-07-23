import express from "express";
import ForumPost from "../models/ForumPost.js";
import ForumComment from "../models/ForumComment.js";
import ForumVote from "../models/ForumVote.js";
import { auth, adminAuth } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all forum posts with optional filtering
router.get("/posts", async (req, res) => {
  try {
    const { region, author, tag, sort = "newest" } = req.query;

    // Build filter object
    const filter = {};
    if (region) filter.region = region;
    if (author) {
      // Ensure author is treated as ObjectId
      try {
        filter.author = new mongoose.Types.ObjectId(author);
      } catch (err) {
        console.error("Invalid author ID format:", author);
        filter.author = author; // Fallback to original value
      }
    }
    if (tag) filter.tags = { $in: [tag] };

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popular":
        sortOption = { likes: -1, upvotes: -1 }; // Use both for backward compatibility
        break;
      case "views":
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await ForumPost.find(filter)
      .sort(sortOption)
      .populate("author", "name picture")
      .populate("region", "name country")
      .populate({
        path: "comments",
        options: { limit: 3, sort: { createdAt: -1 } },
        populate: [
          { path: "author", select: "name picture" },
          {
            path: "replies",
            populate: { path: "author", select: "name picture" },
          },
        ],
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get forum posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get posts by region
router.get("/posts/region/:regionId", async (req, res) => {
  try {
    const { regionId } = req.params;
    const { sort = "newest" } = req.query;

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popular":
        sortOption = { likes: -1, upvotes: -1 }; // Use both for backward compatibility
        break;
      case "views":
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await ForumPost.find({ region: regionId })
      .sort(sortOption)
      .populate("author", "name picture")
      .populate("region", "name country")
      .populate({
        path: "comments",
        options: { limit: 3, sort: { createdAt: -1 } },
        populate: [
          { path: "author", select: "name picture" },
          {
            path: "replies",
            populate: { path: "author", select: "name picture" },
          },
        ],
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get region posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single forum post
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("author", "name picture")
      .populate("region", "name country")
      .populate({
        path: "comments",
        populate: [
          { path: "author", select: "name picture" },
          {
            path: "replies",
            populate: { path: "author", select: "name picture" },
          },
        ],
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Get forum post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new forum post
router.post("/posts", auth, async (req, res) => {
  try {
    const { title, content, region, images, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      author: req.user.id,
      region,
      images,
      tags,
    });

    await post.save();

    // Populate author and region details
    await post.populate("author", "name picture");
    await post.populate("region", "name country");

    // Notify users who follow this region (if implemented)
    if (req.io) {
      req.io.emit("newForumPost", {
        postId: post._id,
        title: post.title,
        region: post.region,
      });
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("Create forum post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a forum post
router.put("/posts/:id", auth, async (req, res) => {
  try {
    const { title, content, images, tags } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (images) post.images = images;
    if (tags) post.tags = tags;

    post.updatedAt = Date.now();

    await post.save();

    // Populate author and region details
    await post.populate("author", "name picture");
    await post.populate("region", "name country");

    res.status(200).json(post);
  } catch (error) {
    console.error("Update forum post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a forum post
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    console.log(
      `Delete request for post ID: ${req.params.id} by user ID: ${req.user.id}`
    );

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      console.log(`Post not found: ${req.params.id}`);
      return res.status(404).json({ message: "Post not found" });
    }

    // Log the post author and requesting user for debugging
    console.log(`Post author: ${post.author}, Requesting user: ${req.user.id}`);

    // Check if user is the author or an admin
    // Convert both IDs to strings for reliable comparison
    const postAuthorId = post.author.toString();
    const requestUserId = req.user.id.toString();

    console.log(
      `Comparing IDs - Post author: ${postAuthorId} (${typeof postAuthorId}), User: ${requestUserId} (${typeof requestUserId})`
    );
    console.log(`Direct comparison result: ${postAuthorId === requestUserId}`);

    // Try multiple comparison methods to ensure it works
    const directMatch = postAuthorId === requestUserId;
    const objectIdMatch = String(post.author) === String(req.user.id);

    console.log(`Alternative comparison methods:`, {
      directMatch,
      objectIdMatch,
      postAuthorIdLength: postAuthorId.length,
      requestUserIdLength: requestUserId.length,
    });

    // Allow the delete if any comparison method matches or user is admin
    if (!directMatch && !objectIdMatch && req.user.role !== "admin") {
      console.log(
        `Unauthorized delete attempt: User ${requestUserId} tried to delete post by ${postAuthorId}`
      );
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete all comments associated with this post
    const commentsResult = await ForumComment.deleteMany({ post: post._id });
    console.log(
      `Deleted ${commentsResult.deletedCount} comments associated with post ${post._id}`
    );

    // Delete all votes associated with this post
    const votesResult = await ForumVote.deleteMany({
      contentType: "post",
      contentId: post._id,
    });
    console.log(
      `Deleted ${votesResult.deletedCount} votes associated with post ${post._id}`
    );

    // Delete the post
    await post.deleteOne();
    console.log(`Post ${req.params.id} successfully deleted`);

    res.status(200).json({
      message: "Post deleted successfully",
      postId: req.params.id,
      title: post.title,
    });
  } catch (error) {
    console.error("Delete forum post error:", error);

    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Post not found - invalid ID format" });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Add a comment to a post
router.post("/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content, images, parentComment } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new ForumComment({
      content,
      author: req.user.id,
      post: post._id,
      images,
      parentComment,
    });

    await comment.save();

    // If this is a reply to another comment, add it to the parent's replies
    if (parentComment) {
      const parent = await ForumComment.findById(parentComment);
      if (parent) {
        parent.replies.push(comment._id);
        await parent.save();
      }
    }

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    // Populate author details
    await comment.populate("author", "name picture");

    // Notify the post author about the new comment
    if (req.io && post.author.toString() !== req.user.id) {
      req.io.to(post.author.toString()).emit("newComment", {
        postId: post._id,
        commentId: comment._id,
        postTitle: post.title,
        commenter: req.user.name,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a comment
router.put("/comments/:id", auth, async (req, res) => {
  try {
    const { content, images } = req.body;

    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author or an admin
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    // Update fields
    if (content) comment.content = content;
    if (images) comment.images = images;

    comment.updatedAt = Date.now();

    await comment.save();

    // Populate author details
    await comment.populate("author", "name picture");

    res.status(200).json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment
router.delete("/comments/:id", auth, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author or an admin
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment from post's comments array
    await ForumPost.updateOne(
      { _id: comment.post },
      { $pull: { comments: comment._id } }
    );

    // If this comment is a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await ForumComment.updateOne(
        { _id: comment.parentComment },
        { $pull: { replies: comment._id } }
      );
    }

    // Delete all replies to this comment
    await ForumComment.deleteMany({ parentComment: comment._id });

    // Delete all votes associated with this comment
    await ForumVote.deleteMany({
      contentType: "comment",
      contentId: comment._id,
    });

    // Delete the comment
    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Vote on a post
router.post("/posts/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body;

    if (!["like", "dislike", "upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already voted on this post
    const existingVote = await ForumVote.findOne({
      user: req.user.id,
      contentType: "post",
      contentId: post._id,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Map old vote types to new ones for backward compatibility
      const effectiveVoteType =
        voteType === "upvote"
          ? "like"
          : voteType === "downvote"
          ? "dislike"
          : voteType;

      if (existingVote) {
        // If vote type is the same, remove the vote
        if (existingVote.voteType === effectiveVoteType) {
          // Remove the vote
          await ForumVote.deleteOne({ _id: existingVote._id }).session(session);

          // Update post vote count
          if (effectiveVoteType === "like") {
            post.likes = Math.max(0, post.likes - 1);
          } else if (effectiveVoteType === "dislike") {
            post.dislikes = Math.max(0, post.dislikes - 1);
          }

          // Also update legacy fields for backward compatibility
          if (effectiveVoteType === "like") {
            post.upvotes = Math.max(0, post.upvotes - 1);
          } else if (effectiveVoteType === "dislike") {
            post.downvotes = Math.max(0, post.downvotes - 1);
          }
        } else {
          // Change vote type
          const oldVoteType = existingVote.voteType;
          existingVote.voteType = effectiveVoteType;
          await existingVote.save({ session });

          // Update post vote count
          if (oldVoteType === "like" || oldVoteType === "upvote") {
            post.likes = Math.max(0, post.likes - 1);
            post.upvotes = Math.max(0, post.upvotes - 1);
          } else if (oldVoteType === "dislike" || oldVoteType === "downvote") {
            post.dislikes = Math.max(0, post.dislikes - 1);
            post.downvotes = Math.max(0, post.downvotes - 1);
          }

          if (effectiveVoteType === "like") {
            post.likes += 1;
            post.upvotes += 1;
          } else if (effectiveVoteType === "dislike") {
            post.dislikes += 1;
            post.downvotes += 1;
          }
        }
      } else {
        // Create new vote
        const vote = new ForumVote({
          user: req.user.id,
          contentType: "post",
          contentId: post._id,
          voteType: effectiveVoteType,
        });

        await vote.save({ session });

        // Update post vote count
        if (effectiveVoteType === "like") {
          post.likes += 1;
          post.upvotes += 1; // For backward compatibility
        } else if (effectiveVoteType === "dislike") {
          post.dislikes += 1;
          post.downvotes += 1; // For backward compatibility
        }
      }

      await post.save({ session });
      await session.commitTransaction();

      res.status(200).json({
        likes: post.likes,
        dislikes: post.dislikes,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Vote on post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Vote on a comment
router.post("/comments/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body;

    if (!["like", "dislike", "upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user has already voted on this comment
    const existingVote = await ForumVote.findOne({
      user: req.user.id,
      contentType: "comment",
      contentId: comment._id,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Map old vote types to new ones for backward compatibility
      const effectiveVoteType =
        voteType === "upvote"
          ? "like"
          : voteType === "downvote"
          ? "dislike"
          : voteType;

      if (existingVote) {
        // If vote type is the same, remove the vote
        if (existingVote.voteType === effectiveVoteType) {
          // Remove the vote
          await ForumVote.deleteOne({ _id: existingVote._id }).session(session);

          // Update comment vote count
          if (effectiveVoteType === "like") {
            comment.likes = Math.max(0, comment.likes - 1);
          } else if (effectiveVoteType === "dislike") {
            comment.dislikes = Math.max(0, comment.dislikes - 1);
          }

          // Also update legacy fields for backward compatibility
          if (effectiveVoteType === "like") {
            comment.upvotes = Math.max(0, comment.upvotes - 1);
          } else if (effectiveVoteType === "dislike") {
            comment.downvotes = Math.max(0, comment.downvotes - 1);
          }
        } else {
          // Change vote type
          const oldVoteType = existingVote.voteType;
          existingVote.voteType = effectiveVoteType;
          await existingVote.save({ session });

          // Update comment vote count
          if (oldVoteType === "like" || oldVoteType === "upvote") {
            comment.likes = Math.max(0, comment.likes - 1);
            comment.upvotes = Math.max(0, comment.upvotes - 1);
          } else if (oldVoteType === "dislike" || oldVoteType === "downvote") {
            comment.dislikes = Math.max(0, comment.dislikes - 1);
            comment.downvotes = Math.max(0, comment.downvotes - 1);
          }

          if (effectiveVoteType === "like") {
            comment.likes += 1;
            comment.upvotes += 1;
          } else if (effectiveVoteType === "dislike") {
            comment.dislikes += 1;
            comment.downvotes += 1;
          }
        }
      } else {
        // Create new vote
        const vote = new ForumVote({
          user: req.user.id,
          contentType: "comment",
          contentId: comment._id,
          voteType: effectiveVoteType,
        });

        await vote.save({ session });

        // Update comment vote count
        if (effectiveVoteType === "like") {
          comment.likes += 1;
          comment.upvotes += 1; // For backward compatibility
        } else if (effectiveVoteType === "dislike") {
          comment.dislikes += 1;
          comment.downvotes += 1; // For backward compatibility
        }
      }

      await comment.save({ session });
      await session.commitTransaction();

      res.status(200).json({
        likes: comment.likes,
        dislikes: comment.dislikes,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Vote on comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's vote on a post
router.get("/posts/:id/vote", auth, async (req, res) => {
  try {
    const vote = await ForumVote.findOne({
      user: req.user.id,
      contentType: "post",
      contentId: req.params.id,
    });

    // Map old vote types to new ones for backward compatibility
    let voteType = null;
    if (vote) {
      if (vote.voteType === "upvote") {
        voteType = "like";
      } else if (vote.voteType === "downvote") {
        voteType = "dislike";
      } else {
        voteType = vote.voteType;
      }
    }

    res.status(200).json({
      voteType: voteType,
    });
  } catch (error) {
    console.error("Get user vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's vote on a comment
router.get("/comments/:id/vote", auth, async (req, res) => {
  try {
    const vote = await ForumVote.findOne({
      user: req.user.id,
      contentType: "comment",
      contentId: req.params.id,
    });

    // Map old vote types to new ones for backward compatibility
    let voteType = null;
    if (vote) {
      if (vote.voteType === "upvote") {
        voteType = "like";
      } else if (vote.voteType === "downvote") {
        voteType = "dislike";
      } else {
        voteType = vote.voteType;
      }
    }

    res.status(200).json({
      voteType: voteType,
    });
  } catch (error) {
    console.error("Get user vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Sticky/unsticky a post
router.patch("/posts/:id/sticky", adminAuth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.isSticky = !post.isSticky;
    await post.save();

    res.status(200).json({
      isSticky: post.isSticky,
    });
  } catch (error) {
    console.error("Sticky post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Debug route to check user ID and post author
router.get("/debug/user-posts", auth, async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.id;

    // Find posts by this user
    const posts = await ForumPost.find({})
      .populate("author", "name picture")
      .limit(20);

    // Process posts to check author matching using multiple methods
    const processedPosts = posts.map((post) => {
      // Get author ID as string
      const postAuthorId = post.author._id.toString();
      const requestUserId = userId.toString();

      // Try multiple comparison methods
      const directMatch = postAuthorId === requestUserId;
      const objectIdMatch = String(post.author._id) === String(userId);
      const isMatch = directMatch || objectIdMatch;

      return {
        postId: post._id,
        title: post.title,
        authorId: postAuthorId,
        authorIdType: typeof postAuthorId,
        userId: requestUserId,
        userIdType: typeof requestUserId,
        authorIdLength: postAuthorId.length,
        userIdLength: requestUserId.length,
        directMatch: directMatch,
        objectIdMatch: objectIdMatch,
        isMatch: isMatch,
      };
    });

    // Filter to find user's posts
    const userPosts = processedPosts.filter((post) => post.isMatch);

    // Get full post data for user posts
    const userPostIds = userPosts.map((post) => post.postId);
    const fullUserPosts = await ForumPost.find({ _id: { $in: userPostIds } })
      .populate("author", "name picture")
      .populate("region", "name")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name picture",
        },
      })
      .sort({ createdAt: -1 });

    // Return detailed information
    res.status(200).json({
      userId: userId,
      userIdType: typeof userId,
      totalPosts: posts.length,
      userPostsCount: userPosts.length,
      userPosts: userPosts,
      fullUserPosts: fullUserPosts,
      allPostsInfo: processedPosts,
    });
  } catch (error) {
    console.error("Debug route error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin: Close/open a post
router.patch("/posts/:id/close", adminAuth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.isClosed = !post.isClosed;
    await post.save();

    res.status(200).json({
      isClosed: post.isClosed,
    });
  } catch (error) {
    console.error("Close post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
