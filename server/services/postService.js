const { users } = require("../data/users")
const { posts } = require("../data/posts");

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
    return newPost;
}

function getAllPostsService() {
    return [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

function deletePostService(id) {
    const index = posts.findIndex(post => post.id === Number(id));

    if (index === -1) {
        return null;
    }

    const deletedPost = posts.splice(index, 1)[0];
    return deletedPost;
}

function likePostService(id) {
    const post = posts.find(post => post.id === Number(id));

    if (!post) {
        return null;
    }

    post.likes += 1;
    return post;
}

function getPostByIdService(id) {
    const post = posts.find(post => post.id === Number(id));

    if (!post) {
        return null;
    }

    return post;
}

function updatePostService(id, content) {
    const post = posts.find(post => post.id === Number(id));

    if (!post) {
        return null;
    }

    post.content = content;
    post.updatedAt = new Date().toISOString();

    return post;
}

function addCommentService(id, authorId, content) {
    const post = posts.find(post => post.id === Number(id));

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
    return newComment;
}

function getCommentsByPostIdService(id) {
    const post = posts.find(post => post.id === Number(id));

    if (!post) {
        return null;
    }

    return post.comments;
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

    return comment;
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

module.exports = {
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
    likeCommentService
};