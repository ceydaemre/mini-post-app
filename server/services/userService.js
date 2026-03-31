const { buildSafeUser, buildPostResponse, buildCommentResponse } = require("../../utils/userMapper");
const { shapePost, shapeComment } = require("./postService");
const { users } = require("../data/users");
const { posts } = require("../data/posts");

function registerUserService(username, email, password, avatar, bio) {
    const existingMail = users.find(user => user.email === email);
    const existingUsername = users.find(user => user.username === username);

    if (existingMail) {
        return "EMAIL_ALREADY_EXISTS";
    }

    if (existingUsername) {
        return "USERNAME_ALREADY_EXISTS";
    }

    const maxId = users.length > 0
        ? Math.max(...users.map(user => user.id))
        : 0;

    const newUser = {
        id: maxId + 1,
        username,
        email,
        password,
        avatar: avatar || "default-avatar.png",
        bio: bio || "",
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    users.push(newUser);

    return buildSafeUser(newUser);
}

function loginUserService(email, password) {
    const user = users.find(user => user.email === email);

    if (!user) {
        return "USER_NOT_FOUND";
    }

    if (user.password !== password) {
        return "INVALID_PASSWORD";
    }

    const token = "user-" + user.id;

    return {
        user: buildSafeUser(user),
        token
    };
}

function getAllUsersService() {
    return users.map(buildSafeUser);
}

function getUserByIdService(userId) {
    const user = users.find(user => user.id === Number(userId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    return buildSafeUser(user);
}

function updateUserService(userId, username, email, avatar, bio) {
    const user = users.find(user => user.id === Number(userId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    const existingEmail = users.find(
        user => user.email === email && user.id !== Number(userId)
    );

    const existingUsername = users.find(
        user => user.username === username && user.id !== Number(userId)
    );

    if (email !== undefined && existingEmail) {
        return "EMAIL_ALREADY_EXISTS";
    }

    if (username !== undefined && existingUsername) {
        return "USERNAME_ALREADY_EXISTS";
    }

    if (username !== undefined) {
        user.username = username;
    }

    if (email !== undefined) {
        user.email = email;
    }

    if (avatar !== undefined) {
        user.avatar = avatar;
    }

    if (bio !== undefined) {
        user.bio = bio;
    }

    user.updatedAt = new Date().toISOString();

    return buildSafeUser(user);
}

function deleteUserService(userId) {
    const index = users.findIndex(user => user.id === Number(userId));

    if (index === -1) {
        return "USER_NOT_FOUND";
    }

    const deletedUser = users.splice(index, 1)[0];

    return buildSafeUser(deletedUser);
}

function getPostsByUserIdService(userId) {
    const user = users.find(user => user.id === Number(userId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    const userPosts = posts.filter(post => post.authorId === Number(userId));
    const shapedPosts = userPosts.map(post => shapePost(post));

    return shapedPosts;
}

function getCommentsByUserIdService(userId) {
    const user = users.find(user => user.id === Number(userId));

    if (!user) {
        return "USER_NOT_FOUND";
    }

    const userComments = [];

    posts.forEach(post => {
        const matchedComments = post.comments.filter(
            comment => comment.authorId === Number(userId)
        );

        const shaped = matchedComments.map(comment => shapeComment(comment));

        userComments.push(...shaped);
    });

    return userComments;
}

module.exports = {
    registerUserService,
    loginUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getPostsByUserIdService,
    getCommentsByUserIdService
};