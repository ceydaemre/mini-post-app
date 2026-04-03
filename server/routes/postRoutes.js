const express = require("express");
const router = express.Router();

const {
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
    likeComment,
    addReplyToComment,
    getCommentThread
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");

router.post("/", authMiddleware, createPost);
router.get("/", optionalAuthMiddleware, getAllPosts);

router.get("/:id", optionalAuthMiddleware, getPostById);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

router.patch("/:id/likes", authMiddleware, likePost);
router.patch("/:id/repost",authMiddleware ,repostPost);
router.post("/:id/quote-repost", authMiddleware, quoteRepostPost);

router.post("/:id/comments", authMiddleware, addComment);
router.get("/:id/comments", optionalAuthMiddleware, getCommentsByPostId);

router.get("/:postId/comments/:commentId", optionalAuthMiddleware, getCommentById);
router.patch("/:postId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);
router.get("/:parentPostId/comments/:commentId/thread", optionalAuthMiddleware, getCommentThread);
router.post("/:postId/comments/:parentCommentId/replies", authMiddleware, addReplyToComment);
router.patch("/:postId/comments/:commentId/likes", authMiddleware, likeComment);

module.exports = router;




