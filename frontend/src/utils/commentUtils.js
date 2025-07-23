/**
 * Utility functions for handling comments in the forum
 */

/**
 * Calculates the total number of comments including replies
 * @param {Array|Number} comments - Array of comments or a number representing the comment count
 * @returns {Number} - Total number of comments including replies
 */
export const getTotalCommentCount = (comments) => {
  if (!comments) return 0;
  
  // If comments is just a number (length), return it directly
  if (typeof comments === 'number') return comments;
  
  // If comments is not an array, return 0
  if (!Array.isArray(comments)) return 0;
  
  return comments.reduce((total, comment) => {
    // Count this comment
    let count = 1;
    // Add the count of any replies
    if (comment.replies && Array.isArray(comment.replies)) {
      count += comment.replies.length;
    }
    return total + count;
  }, 0);
};
