const { users } = require("../data/users");
const { posts } = require("../data/posts");
const { buildPostResponse, buildCommentResponse } = require("../../utils/userMapper");

function shapeComment(comment, currentUserId) {
    const commentAuthor = users.find(user => user.id === comment.authorId);

    const shapedComment = buildCommentResponse(comment, commentAuthor, currentUserId);
    return shapedComment;
}

function shapePost(post, currentUserId) {
    const postAuthor = users.find(user => user.id === post.authorId);

    const comments = post.comments.map(comment => shapeComment(comment, currentUserId));

    return buildPostResponse(post, postAuthor, comments, currentUserId);
}

function createPostService(authorId, content) {
    const user = users.find(user => user.id === Number(authorId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    const maxId = posts.length > 0
        ? Math.max(...posts.map(post => post.id))
        : 0;

    const newPost = {
        id: maxId + 1,
        authorId: Number(authorId),
        content,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: null,
        comments: []
    };

    posts.push(newPost);

    return shapePost(newPost, authorId);
}

function getAllPostsService(currentUserId) {
    const shapedPosts = posts.map(post => shapePost(post, currentUserId));

    return [...shapedPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

function findPostByIdService(postId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    return post;
}

function deletePostService(postId) {
    const index = posts.findIndex(post => post.id === Number(postId));

    if (index === -1) {
        return null;
    }

    const deletedPost = posts.splice(index, 1)[0];
    return deletedPost;
}

function likePostService(postId, userId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    const userIndex = post.likes.findIndex(
        likedUserId => likedUserId === Number(userId)
    );

    if (userIndex === -1) {
        post.likes.push(Number(userId));
    } else {
        post.likes.splice(userIndex, 1);
    }

    return shapePost(post, userId);
}

function getPostByIdService(postId, currentUserId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    return shapePost(post, currentUserId);
}

function updatePostService(postId, content, currentUserId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    post.content = content;
    post.updatedAt = new Date().toISOString();

    return shapePost(post, currentUserId);
}

function addCommentService(postId, authorId, content) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const user = users.find(user => user.id === Number(authorId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    const maxCommentId = post.comments.length > 0
        ? Math.max(...post.comments.map(comment => comment.id))
        : 0;

    const newComment = {
        id: maxCommentId + 1,
        authorId: Number(authorId),
        content,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    post.comments.push(newComment);
    return shapeComment(newComment, authorId);
}

function getCommentsByPostIdService(postId, currentUserId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    const shapedComments = post.comments.map(comment => shapeComment(comment, currentUserId));

    return shapedComments;
}

function findCommentByIdService(postId, commentId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        comment => comment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    return comment;
}

function deleteCommentService(postId, commentId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const commentIndex = post.comments.findIndex(
        comment => comment.id === Number(commentId)
    );

    if (commentIndex === -1) {
        return "COMMENT_NOT_FOUND";
    }

    const deletedComment = post.comments.splice(commentIndex, 1)[0];
    return deletedComment;
}

function updateCommentService(postId, commentId, content, currentUserId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        comment => comment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    comment.content = content;
    comment.updatedAt = new Date().toISOString();

    return shapeComment(comment, currentUserId);
}

function likeCommentService(postId, commentId, userId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        comment => comment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    const userLikeIndex = comment.likes.findIndex(
        like => like === Number(userId)
    );

    if (userLikeIndex === -1) {
        comment.likes.push(Number(userId));
    } else {
        comment.likes.splice(userLikeIndex, 1);
    }

    return shapeComment(comment, userId);
}

function getCommentByIdService(postId, commentId, currentUserId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        comment => comment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    return shapeComment(comment, currentUserId);
}

module.exports = {
    shapeComment,
    shapePost,
    createPostService,
    getAllPostsService,
    findPostByIdService,
    deletePostService,
    likePostService,
    getPostByIdService,
    updatePostService,
    addCommentService,
    getCommentsByPostIdService,
    findCommentByIdService,
    deleteCommentService,
    updateCommentService,
    likeCommentService,
    getCommentByIdService
};