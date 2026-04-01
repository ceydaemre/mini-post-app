const {
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
    getCommentByIdService,
    findPostByIdService,
    findCommentByIdService,
    repostPostService,
    quoteRepostPostService
} = require("../services/postService");

const { validateContent } = require("../../utils/validation");

function createPost(req, res) {
    const authorId = req.user.id;
    const { content } = req.body;

    const contentError = validateContent(content);

    if (contentError) {
        return res.status(400).json({
            message: contentError
        });
    }

    const newPost = createPostService(authorId, content.trim());

    if (newPost === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Post oluşturuldu.",
        data: newPost
    });
}

function getAllPosts(req, res) {
    const currentUserId = req.user?.id;
    const posts = getAllPostsService(currentUserId);

    return res.status(200).json({
        message: "Postlar getirildi.",
        data: posts
    });
}

function deletePost(req, res) {
    const id = req.params.id;
    const currentUserId = req.user.id;

    const rawPost = findPostByIdService(id);

    if (!rawPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawPost.authorId !== currentUserId) {
        return res.status(403).json({
            message: "Bu postu silme yetkiniz yok."
        });
    }

    const deletedPost = deletePostService(id);

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
    const userId = req.user.id;
    const likedPost = likePostService(postId, userId);

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

function getPostById(req, res) {
    const id = req.params.id;
    const currentUserId = req.user?.id;
    const post = getPostByIdService(id, currentUserId);

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
    const id = req.params.id;
    const currentUserId = req.user.id;
    const { content } = req.body;

    const rawPost = findPostByIdService(id);

    if (!rawPost) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (rawPost.authorId !== currentUserId) {
        return res.status(403).json({
            message: "Bu postu güncelleme yetkiniz yok."
        });
    }

    const contentError = validateContent(content);

    if (contentError) {
        return res.status(400).json({
            message: contentError
        });
    }

    const updatedPost = updatePostService(id, content.trim(), currentUserId);

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

function addComment(req, res) {
    const id = req.params.id;
    const authorId = req.user.id;
    const { content } = req.body;

    const contentError = validateContent(content);

    if (contentError) {
        return res.status(400).json({
            message: contentError
        });
    }

    const newComment = addCommentService(id, authorId, content.trim());

    if (newComment === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (newComment === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Yorum eklendi.",
        data: newComment
    });
}

function getCommentsByPostId(req, res) {
    const id = req.params.id;
    const currentUserId = req.user?.id;
    const comments = getCommentsByPostIdService(id, currentUserId);

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

function deleteComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const currentUserId = req.user.id;

    const comment = findCommentByIdService(postId, commentId);

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

    if (comment.authorId !== currentUserId) {
        return res.status(403).json({
            message: "Bu yorumu silme yetkiniz yok."
        });
    }

    const result = deleteCommentService(postId, commentId);

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (result === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum silindi.",
        data: result
    });
}

function updateComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { content } = req.body;
    const currentUserId = req.user.id;

    const comment = findCommentByIdService(postId, commentId);

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

    if (comment.authorId !== currentUserId) {
        return res.status(403).json({
            message: "Bu yorumu güncelleme yetkiniz yok."
        });
    }

    const contentError = validateContent(content);

    if (contentError) {
        return res.status(400).json({
            message: contentError
        });
    }

    const result = updateCommentService(postId, commentId, content.trim(), currentUserId);

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (result === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum güncellendi.",
        data: result
    });
}

function likeComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const result = likeCommentService(postId, commentId, userId);

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    if (result === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
            message: "Yorum bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Yorum beğenildi.",
        data: result
    });
}

function getCommentById(req, res) {
    const { postId, commentId } = req.params;
    const currentUserId = req.user?.id;

    const comment = getCommentByIdService(postId, commentId, currentUserId);

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

function repostPost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = repostPostService(postId, userId);

    if(result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message : "Post bulunamadı."
        });
    }

    const message = 
        result.action === "REPOSTED"
        ? "Post repostlandı."
        : "Repost geri alındı.";

    return res.status(200).json({
        message,
        data : result.post
    });
}

function quoteRepostPost(req, res) {
    const originalPostId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content;

    const contentError = validateContent(content);

    if(contentError) {
        return res.status(400).json({
            message : contentError
        });
    }

    const result = quoteRepostPostService(originalPostId, userId, content.trim());

    if(result === "USER_NOT_FOUND") {
        return res.status(404).json({
            message : "Kullanıcı bulunamadı." 
        });
    }

    if(result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message : "Post bulunamadı."
        });
    }

    return res.status(201).json({
        message : "Post alıntılandı.",
        data : result
    });
}

function quoteRepostPost(req, res) {
    const originalPostId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content;

    const contentError = validateContent(content);

    if (contentError) {
        return res.status(400).json({
            message: contentError
        });
    }

    const result = quoteRepostPostService(
        originalPostId,
        userId,
        content.trim()
    );

    if (result === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(201).json({
        message: "Quote repost oluşturuldu.",
        data: result
    });
}

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    likePost,
    getPostById,
    updatePost,
    addComment,
    getCommentsByPostId,
    deleteComment,
    updateComment,
    likeComment,
    getCommentById,
    repostPost,
    quoteRepostPost
};