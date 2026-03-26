function buildSafeUser(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
}

function buildPublicUser(user) {
  return {
    id : user.id,
    username : user.username,
    avatar : user.avatar
  };
}

function buildCommentResponse(comment, author) {
  return {
    id : comment.id,
    content : comment.content,
    likes : comment.likes,
    createdAt : comment.createdAt,
    updatedAt : comment.updatedAt,
    author : buildPublicUser(author)
  };
}

function buildPostResponse(post, author, comments) {
  return {
    id : post.id,
    content : post.content,
    likes : post.likes,
    createdAt : post.createdAt,
    updatedAt : post.updatedAt,
    author : buildPublicUser(author),
    comments : comments
  };
}
  
module.exports = {
    buildSafeUser,
    buildPublicUser,
    buildCommentResponse,
    buildPostResponse
};