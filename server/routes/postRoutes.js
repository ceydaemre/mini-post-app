const express = require("express");
const router = express.Router();

const {
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
    likeComment
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);

router.get("/:id", getPostById);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likes", likePost);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getCommentsByPostId);

router.delete("/:postId/comments/:commentId", deleteComment);
router.patch("/:postId/comments/:commentId", updateComment);
router.patch("/:postId/comments/:commentId/likes", likeComment);

module.exports = router;