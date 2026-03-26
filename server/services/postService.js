const { users } = require("../data/users");
const { posts } = require("../data/posts");
const { buildPostResponse, buildCommentResponse } = require("../../utils/userMapper");

function shapeComment(comment) {
    const commentAuthor = users.find(user => user.id === comment.authorId);

    const shapedComment = buildCommentResponse(comment, commentAuthor);
    return shapedComment;
}

function shapePost(post) {
    const postAuthor = users.find(user => user.id === post.authorId );

    const comments = post.comments.map(comment => shapeComment(comment));

    return buildPostResponse(post, postAuthor, comments);
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
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        comments: []
    };

    posts.push(newPost);

    return shapePost(newPost);
}

function getAllPostsService() {
    
    const shapedPosts = posts.map(post => shapePost(post));

    return [...shapedPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

function deletePostService(postId) {
    const index = posts.findIndex(post => post.id === Number(postId));

    if (index === -1) {
        return null;
    }

    const deletedPost = posts.splice(index, 1)[0];
    return deletedPost;
}

function likePostService(postId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    post.likes += 1;
    return post;
}

function getPostByIdService(postId) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    return shapePost(post);
}

function updatePostService(postId, content) {
    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    post.content = content;
    post.updatedAt = new Date().toISOString();

    return shapePost(post);;
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
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    post.comments.push(newComment);
    return shapeComment(newComment);
}

function getCommentsByPostIdService(postId) {

    const post = posts.find(post => post.id === Number(postId));

    if (!post) {
        return null;
    }

    const shapedComments = post.comments.map(comment => shapeComment(comment));

    return shapedComments;
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

function updateCommentService(postId, commentId, content) {
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

    return shapeComment(comment);
}

function likeCommentService(postId, commentId) {
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

    comment.likes += 1;
    return comment;
}

function getCommentByIdService(postId, commentId) {
    const post = posts.find(post => post.id === Number(postId));

    if(!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(comment => comment.id === Number(commentId));

    if(!comment) {
        return "COMMENT_NOT_FOUND";
    }

    return shapeComment(comment);

}

module.exports = {
    shapeComment,
    shapePost,
    createPostService,
    getAllPostsService,
    deletePostService,
    likePostService,
    getPostByIdService,
    updatePostService,
    addCommentService,
    getCommentsByPostIdService,
    deleteCommentService,
    updateCommentService,
    likeCommentService,
    getCommentByIdService
};