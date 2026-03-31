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
    getCommentsByUserId
} = require("../controllers/userController");

router.get("/", getAllUsers);

router.get("/:id/posts", getPostsByUserId);
router.get("/:id/comments", getCommentsByUserId);
router.get("/:id", getUserById);

router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;