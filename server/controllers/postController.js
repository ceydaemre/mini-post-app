const {
    createPostService,
    getAllPostsService,
    getPostByIdService,
    updatePostService,
    deletePostService,
    likePostService,
    repostPostService,
    quoteRepostPostService,
    addCommentService,
    getCommentsByPostIdService,
    getCommentByIdService,
    updateCommentService,
    deleteCommentService,
    likeCommentService,
    findPostByIdService,
    findCommentByIdService
} = require("../services/postService");

const { validateContent } = require("../../utils/validation");

function createPost(req, res) {
    const authorId = req.user.id;
    const { content } = req.body;

    const contentError = validateContent(content);
    if (contentError) {
        return res.status(400).json({ message: contentError });
    }

    const createdPost = createPostService(authorId, content.trim());

    if (createdPost === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Post oluşturuldu.",
        data: createdPost
    });
}

function getAllPosts(req, res) {
    const viewerUserId = req.user?.id;
    const posts = getAllPostsService(viewerUserId);

    return res.status(200).json({
        message: "Postlar getirildi.",
        data: posts
    });
}

function getPostById(req, res) {
    const postId = req.params.id;
    const viewerUserId = req.user?.id;

    const post = getPostByIdService(postId, viewerUserId);

    if (!post) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Post getirildi.",
        data: post
    });
}

function updatePost(req, res) {
    const postId = req.params.id;
    const actingUserId = req.user.id;
    const { content } = req.body;

    const rawPost = findPostByIdService(postId);

    if (!rawPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawPost.authorId !== actingUserId) {
        return res.status(403).json({
            message: "Bu postu güncelleme yetkiniz yok."
        });
    }

    const contentError = validateContent(content);
    if (contentError) {
        return res.status(400).json({ message: contentError });
    }

    const updatedPost = updatePostService(postId, content.trim(), actingUserId);

    if (!updatedPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Post güncellendi.",
        data: updatedPost
    });
}

function deletePost(req, res) {
    const postId = req.params.id;
    const actingUserId = req.user.id;

    const rawPost = findPostByIdService(postId);

    if (!rawPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawPost.authorId !== actingUserId) {
        return res.status(403).json({
            message: "Bu postu silme yetkiniz yok."
        });
    }

    const deletedPost = deletePostService(postId);

    if (!deletedPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Post silindi.",
        data: deletedPost
    });
}

function likePost(req, res) {
    const postId = req.params.id;
    const actingUserId = req.user.id;

    const likedPost = likePostService(postId, actingUserId);

    if (!likedPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Post beğenildi.",
        data: likedPost
    });
}

function repostPost(req, res) {
    const postId = req.params.id;
    const actingUserId = req.user.id;

    const result = repostPostService(postId, actingUserId);

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    const message =
        result.action === "REPOSTED"
            ? "Post repostlandı."
            : "Repost geri alındı.";

    return res.status(200).json({
        message,
        data: result.post
    });
}

function quoteRepostPost(req, res) {
    const originalPostId = req.params.id;
    const actingUserId = req.user.id;
    const { content } = req.body;

    const contentError = validateContent(content);
    if (contentError) {
        return res.status(400).json({ message: contentError });
    }

    const createdQuoteRepost = quoteRepostPostService(
        originalPostId,
        actingUserId,
        content.trim()
    );

    if (createdQuoteRepost === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    if (createdQuoteRepost === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Quote repost oluşturuldu.",
        data: createdQuoteRepost
    });
}

function addComment(req, res) {
    const postId = req.params.id;
    const authorId = req.user.id;
    const { content } = req.body;

    const contentError = validateContent(content);
    if (contentError) {
        return res.status(400).json({ message: contentError });
    }

    const createdComment = addCommentService(postId, authorId, content.trim());

    if (createdComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (createdComment === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Yorum eklendi.",
        data: createdComment
    });
}

function getCommentsByPostId(req, res) {
    const postId = req.params.id;
    const viewerUserId = req.user?.id;

    const comments = getCommentsByPostIdService(postId, viewerUserId);

    if (!comments) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorumlar getirildi.",
        data: comments
    });
}

function getCommentById(req, res) {
    const { postId, commentId } = req.params;
    const viewerUserId = req.user?.id;

    const comment = getCommentByIdService(postId, commentId, viewerUserId);

    if (comment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (comment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum getirildi.",
        data: comment
    });
}

function updateComment(req, res) {
    const { postId, commentId } = req.params;
    const actingUserId = req.user.id;
    const { content } = req.body;

    const rawComment = findCommentByIdService(postId, commentId);

    if (rawComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawComment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    if (rawComment.authorId !== actingUserId) {
        return res.status(403).json({
            message: "Bu yorumu güncelleme yetkiniz yok."
        });
    }

    const contentError = validateContent(content);
    if (contentError) {
        return res.status(400).json({ message: contentError });
    }

    const updatedComment = updateCommentService(
        postId,
        commentId,
        content.trim(),
        actingUserId
    );

    if (updatedComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (updatedComment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum güncellendi.",
        data: updatedComment
    });
}

function deleteComment(req, res) {
    const { postId, commentId } = req.params;
    const actingUserId = req.user.id;

    const rawComment = findCommentByIdService(postId, commentId);

    if (rawComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawComment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    if (rawComment.authorId !== actingUserId) {
        return res.status(403).json({
            message: "Bu yorumu silme yetkiniz yok."
        });
    }

    const deletedComment = deleteCommentService(postId, commentId);

    if (deletedComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (deletedComment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum silindi.",
        data: deletedComment
    });
}

function likeComment(req, res) {
    const { postId, commentId } = req.params;
    const actingUserId = req.user.id;

    const likedComment = likeCommentService(postId, commentId, actingUserId);

    if (likedComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (likedComment === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum beğenildi.",
        data: likedComment
    });
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    repostPost,
    quoteRepostPost,
    addComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment,
    likeComment
};