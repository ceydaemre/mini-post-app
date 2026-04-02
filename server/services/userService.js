const { buildSafeUser } = require("../../utils/userMapper");
const { shapePost, shapeComment } = require("./postService");
const { users } = require("../data/users");
const { posts } = require("../data/posts");

function findUserById(userId) {
    return users.find(user => user.id === Number(userId));
}

function registerUserService(username, email, password, avatar, bio, headerPhoto) {
    const existingUserWithEmail = users.find(user => user.email === email);
    const existingUserWithUsername = users.find(user => user.username === username);

    if (existingUserWithEmail) {
        return "EMAIL_ALREADY_EXISTS";
    }

    if (existingUserWithUsername) {
        return "USERNAME_ALREADY_EXISTS";
    }

    const maxUserId = users.length > 0
        ? Math.max(...users.map(user => user.id))
        : 0;

    const newUser = {
        id: maxUserId + 1,
        username,
        email,
        password,
        avatar: avatar || "default-avatar.png",
        bio: bio || "",
        headerPhoto: headerPhoto || "default-header.png",
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

    return {
        user: buildSafeUser(user),
        token: `user-${user.id}`
    };
}

function getAllUsersService() {
    return users.map(buildSafeUser);
}

function getUserByIdService(profileUserId) {
    const profileUser = findUserById(profileUserId);

    if (!profileUser) {
        return "USER_NOT_FOUND";
    }

    return buildSafeUser(profileUser);
}

function updateUserService(profileUserId, username, email, avatar, bio, headerPhoto) {
    const profileUser = findUserById(profileUserId);

    if (!profileUser) {
        return "USER_NOT_FOUND";
    }

    const existingUserWithEmail = users.find(
        user =>
            user.email === email &&
            user.id !== Number(profileUserId)
    );

    const existingUserWithUsername = users.find(
        user =>
            user.username === username &&
            user.id !== Number(profileUserId)
    );

    if (email !== undefined && existingUserWithEmail) {
        return "EMAIL_ALREADY_EXISTS";
    }

    if (username !== undefined && existingUserWithUsername) {
        return "USERNAME_ALREADY_EXISTS";
    }

    if (username !== undefined) {
        profileUser.username = username;
    }

    if (email !== undefined) {
        profileUser.email = email;
    }

    if (avatar !== undefined) {
        profileUser.avatar = avatar;
    }

    if (bio !== undefined) {
        profileUser.bio = bio;
    }

    if (headerPhoto !== undefined) {
        profileUser.headerPhoto = headerPhoto;
    }

    profileUser.updatedAt = new Date().toISOString();

    return buildSafeUser(profileUser);
}

function deleteUserService(profileUserId) {
    const userIndex = users.findIndex(
        user => user.id === Number(profileUserId)
    );

    if (userIndex === -1) {
        return "USER_NOT_FOUND";
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    return buildSafeUser(deletedUser);
}

function getPostsByUserIdService(profileUserId, viewerUserId) {
    const profileUser = findUserById(profileUserId);

    if (!profileUser) {
        return "USER_NOT_FOUND";
    }

    const authoredPosts = posts.filter(
        post => post.authorId === Number(profileUserId)
    );

    return authoredPosts.map(post =>
        shapePost(post, viewerUserId)
    );
}

function getCommentsByUserIdService(profileUserId, viewerUserId) {
    const profileUser = findUserById(profileUserId);

    if (!profileUser) {
        return "USER_NOT_FOUND";
    }

    const userComments = [];

    posts.forEach(post => {
        const matchedComments = post.comments.filter(
            comment => comment.authorId === Number(profileUserId)
        );

        const shapedComments = matchedComments.map(comment =>
            shapeComment(comment, viewerUserId)
        );

        userComments.push(...shapedComments);
    });

    return userComments;
}

function getProfilePostsByUserIdService(profileUserId, viewerUserId) {
    const profileUser = findUserById(profileUserId);

    if (!profileUser) {
        return "USER_NOT_FOUND";
    }

    const timelineItems = [];

    posts.forEach(post => {
        if (post.authorId === Number(profileUserId)) {
            timelineItems.push({
                type: "POST",
                timelineCreatedAt: post.createdAt,
                post: shapePost(post, viewerUserId)
            });

            return;
        }

        const userRepost = post.reposts.find(
            repost => repost.userId === Number(profileUserId)
        );

        if (userRepost) {
            timelineItems.push({
                type: "REPOST",
                timelineCreatedAt: userRepost.createdAt,
                post: shapePost(post, viewerUserId)
            });
        }
    });

    timelineItems.sort(
        (a, b) =>
            new Date(b.timelineCreatedAt) - new Date(a.timelineCreatedAt)
    );

    return timelineItems;
}

function getProfileRepliesByUserIdService(profileUserId, viewerUserId) {

    const profileAuthor = users.find(user => user.id === Number(profileUserId));

    if(!profileAuthor) {
        return "USER_NOT_FOUND";
    }

    const timelineItems = [];

    posts.forEach(post => {
        post.comments.forEach(comment => {
            if(comment.authorId === Number(profileUserId)) {
                timelineItems.push({
                    type : "REPLY",
                    timelineCreatedAt : comment.createdAt,
                    comment : shapeComment(comment, viewerUserId),
                    post : shapePost(post, viewerUserId)
                });
            }

            timelineItems.sort((a, b) => new Date(b.timelineCreatedAt) - new Date(a.timelineCreatedAt));

        });
    });
  
    return timelineItems;
}

module.exports = {
    registerUserService,
    loginUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getPostsByUserIdService,
    getCommentsByUserIdService,
    getProfilePostsByUserIdService,
    getProfileRepliesByUserIdService
};