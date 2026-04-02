const { users } = require("../data/users");
const { posts } = require("../data/posts");
const { buildPostResponse, buildCommentResponse } = require("../../utils/userMapper");

function findUserById(userId) {
    return users.find(user => user.id === Number(userId));
}

function findPostById(postId) {
    return posts.find(post => post.id === Number(postId));
}

function shapeComment(comment, viewerUserId) {
    const commentAuthor = findUserById(comment.authorId);

    return buildCommentResponse(comment, commentAuthor, viewerUserId);
}

function shapePost(post, viewerUserId) {
    const postAuthor = findUserById(post.authorId);

    const shapedComments = post.comments.map(comment =>
        shapeComment(comment, viewerUserId)
    );

    let originalPost = null;

    if (post.originalPostId) {
        const foundOriginalPost = findPostById(post.originalPostId);

        if (foundOriginalPost) {
            originalPost = shapePost(foundOriginalPost, viewerUserId);
        }
    }

    const quoteRepostCount = posts.filter(
        currentPost => currentPost.originalPostId === post.id
    ).length;

    const repostsCount = post.reposts.length + quoteRepostCount;

    const isRepostedByCurrentUser =
        post.reposts.some(
            repost => repost.userId === Number(viewerUserId)
        ) ||
        posts.some(
            currentPost =>
                currentPost.originalPostId === post.id &&
                currentPost.authorId === Number(viewerUserId)
        );

    const shapedPost = buildPostResponse(
        post,
        postAuthor,
        shapedComments,
        viewerUserId
    );

    return {
        ...shapedPost,
        repostsCount,
        isRepostedByCurrentUser,
        originalPost
    };
}

function createPostService(authorId, content) {
    const author = findUserById(authorId);

    if (!author) {
        return "USER_NOT_FOUND";
    }

    const maxPostId = posts.length > 0
        ? Math.max(...posts.map(post => post.id))
        : 0;

    const newPost = {
        id: maxPostId + 1,
        authorId: Number(authorId),
        content,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: null,
        originalPostId: null,
        comments: [],
        reposts: []
    };

    posts.push(newPost);

    return shapePost(newPost, authorId);
}

function getAllPostsService(viewerUserId) {
    const shapedPosts = posts.map(post => shapePost(post, viewerUserId));

    return [...shapedPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

function findPostByIdService(postId) {
    const post = findPostById(postId);

    if (!post) {
        return null;
    }

    return post;
}

function deletePostService(postId) {
    const postIndex = posts.findIndex(
        post => post.id === Number(postId)
    );

    if (postIndex === -1) {
        return null;
    }

    const deletedPost = posts.splice(postIndex, 1)[0];
    return deletedPost;
}

function likePostService(postId, actingUserId) {
    const post = findPostById(postId);

    if (!post) {
        return null;
    }

    const likeIndex = post.likes.findIndex(
        likedUserId => likedUserId === Number(actingUserId)
    );

    if (likeIndex === -1) {
        post.likes.push(Number(actingUserId));
    } else {
        post.likes.splice(likeIndex, 1);
    }

    return shapePost(post, actingUserId);
}

function getPostByIdService(postId, viewerUserId) {
    const post = findPostById(postId);

    if (!post) {
        return null;
    }

    return shapePost(post, viewerUserId);
}

function updatePostService(postId, content, actingUserId) {
    const post = findPostById(postId);

    if (!post) {
        return null;
    }

    post.content = content;
    post.updatedAt = new Date().toISOString();

    return shapePost(post, actingUserId);
}

function addCommentService(postId, authorId, content) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const author = findUserById(authorId);

    if (!author) {
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

function getCommentsByPostIdService(postId, viewerUserId) {
    const post = findPostById(postId);

    if (!post) {
        return null;
    }

    return post.comments.map(comment =>
        shapeComment(comment, viewerUserId)
    );
}

function findCommentByIdService(postId, commentId) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        currentComment => currentComment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    return comment;
}

function deleteCommentService(postId, commentId) {
    const post = findPostById(postId);

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

function updateCommentService(postId, commentId, content, viewerUserId) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        currentComment => currentComment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    comment.content = content;
    comment.updatedAt = new Date().toISOString();

    return shapeComment(comment, viewerUserId);
}

function likeCommentService(postId, commentId, actingUserId) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        currentComment => currentComment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    const likeIndex = comment.likes.findIndex(
        likedUserId => likedUserId === Number(actingUserId)
    );

    if (likeIndex === -1) {
        comment.likes.push(Number(actingUserId));
    } else {
        comment.likes.splice(likeIndex, 1);
    }

    return shapeComment(comment, actingUserId);
}

function getCommentByIdService(postId, commentId, viewerUserId) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const comment = post.comments.find(
        currentComment => currentComment.id === Number(commentId)
    );

    if (!comment) {
        return "COMMENT_NOT_FOUND";
    }

    return shapeComment(comment, viewerUserId);
}

function repostPostService(postId, actingUserId) {
    const post = findPostById(postId);

    if (!post) {
        return "POST_NOT_FOUND";
    }

    const repostIndex = post.reposts.findIndex(
        repost => repost.userId === Number(actingUserId)
    );

    if (repostIndex === -1) {
        post.reposts.push({
            userId: Number(actingUserId),
            createdAt: new Date().toISOString()
        });

        return {
            action: "REPOSTED",
            post: shapePost(post, actingUserId)
        };
    }

    post.reposts.splice(repostIndex, 1);

    return {
        action: "UNREPOSTED",
        post: shapePost(post, actingUserId)
    };
}

function quoteRepostPostService(originalPostId, actingUserId, content) {
    const originalPost = findPostById(originalPostId);

    if (!originalPost) {
        return "POST_NOT_FOUND";
    }

    const author = findUserById(actingUserId);

    if (!author) {
        return "USER_NOT_FOUND";
    }

    const maxPostId = posts.length > 0
        ? Math.max(...posts.map(post => post.id))
        : 0;

    const newQuoteRepost = {
        id: maxPostId + 1,
        authorId: Number(actingUserId),
        content,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: null,
        comments: [],
        reposts: [],
        originalPostId: Number(originalPostId)
    };

    posts.push(newQuoteRepost);

    return shapePost(newQuoteRepost, actingUserId);
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
    getCommentByIdService,
    repostPostService,
    quoteRepostPostService
};