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
    likeComment,
    getCommentById
} = require("../controllers/postController");

router.post("/", createPost); //shaped
router.get("/", getAllPosts);///yap ok

router.get("/:id", getPostById); //shaped
router.patch("/:id", updatePost);///yap ok 
router.delete("/:id", deletePost);
router.patch("/:id/likes", likePost);

router.post("/:id/comments", addComment); ///yap ok 
router.get("/:id/comments", getCommentsByPostId); //shaped

router.delete("/:postId/comments/:commentId", deleteComment);
router.patch("/:postId/comments/:commentId", updateComment); ///yap ok 
router.patch("/:postId/comments/:commentId/likes", likeComment);
router.get("/:postId/comments/:commentId", getCommentById);
module.exports = router;