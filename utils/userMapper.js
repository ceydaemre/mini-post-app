const { head } = require("../server/routes/postRoutes");

function buildSafeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    headerPhoto : user.headerPhoto
  };
}

function buildPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
  };
}

function buildCommentResponse(comment, author, currentUserId, replies) {
  return {
    id: comment.id,
    content: comment.content,
    isLikedByCurrentUser: currentUserId
      ? comment.likes.includes(Number(currentUserId))
      : false,
    likesCount: comment.likes.length,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    parentCommentId: comment.parentCommentId,
    replies: replies,
    repliesCount: replies.length,
    author: buildPublicUser(author),

  };
}

function buildPostResponse(post, author, comments, currentUserId) {
  return {
    id: post.id,
    content: post.content,
    isLikedByCurrentUser: currentUserId
      ? post.likes.includes(Number(currentUserId))
      : false,
    likesCount: post.likes.length,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: buildPublicUser(author),
    comments: comments
  };
}



module.exports = {
  buildSafeUser,
  buildPublicUser,
  buildCommentResponse,
  buildPostResponse
};