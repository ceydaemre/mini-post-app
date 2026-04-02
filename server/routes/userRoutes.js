const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getPostsByUserId,
    getCommentsByUserId,
    getProfilePostsByUserId,
    getProfileRepliesByUserId
} = require("../controllers/userController");

const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");

router.get("/", getAllUsers);

router.post("/login", loginUser);
router.post("/register", registerUser);

router.get("/:id/profile-posts", optionalAuthMiddleware, getProfilePostsByUserId)
router.get("/:id/posts", optionalAuthMiddleware, getPostsByUserId);
router.get("/:id/comments", optionalAuthMiddleware, getCommentsByUserId);
router.get("/:id/replies",optionalAuthMiddleware, getProfileRepliesByUserId);
router.get("/:id", getUserById);

router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;