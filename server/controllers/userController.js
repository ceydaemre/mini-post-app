const { validateUsername, validatePassword, validateEmail } = require("../../utils/validation");
const {
    registerUserService,
    loginUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getPostsByUserIdService,
    getCommentsByUserIdService,
    getProfilePostsByUserIdService,
    getProfileRepliesByUserIdService,
} = require("../services/userService");

function registerUser(req, res) {
    const { username, password, email, avatar, bio, headerPhoto } = req.body;

    const usernameError = validateUsername(username);
    if (usernameError) {
        return res.status(400).json({ message: usernameError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ message: emailError });
    }

    const createdUser = registerUserService(
        username.trim(),
        email.trim(),
        password,
        avatar,
        bio,
        headerPhoto
    );

    if (createdUser === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Bu email zaten kullanılıyor."
        });
    }

    if (createdUser === "USERNAME_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Bu username zaten kullanılıyor."
        });
    }

    return res.status(201).json({
        message: "Kullanıcı oluşturuldu.",
        data: createdUser
    });
}

function loginUser(req, res) {
    const { email, password } = req.body;

    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ message: emailError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const loginResult = loginUserService(email.trim(), password);

    if (loginResult === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    if (loginResult === "INVALID_PASSWORD") {
        return res.status(401).json({
            message: "Şifre yanlış."
        });
    }

    return res.status(200).json({
        message: "Giriş başarılı.",
        data: loginResult
    });
}

function getAllUsers(req, res) {
    const users = getAllUsersService();

    return res.status(200).json({
        message: "Kullanıcılar getirildi.",
        data: users
    });
}

function getUserById(req, res) {
    const profileUserId = req.params.id;
    const user = getUserByIdService(profileUserId);

    if (user === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Kullanıcı getirildi.",
        data: user
    });
}

function updateUser(req, res) {
    const profileUserId = req.params.id;
    const { username, email, avatar, bio, headerPhoto } = req.body;

    if (username !== undefined) {
        const usernameError = validateUsername(username);
        if (usernameError) {
            return res.status(400).json({ message: usernameError });
        }
    }

    if (email !== undefined) {
        const emailError = validateEmail(email);
        if (emailError) {
            return res.status(400).json({ message: emailError });
        }
    }

    const updatedUser = updateUserService(
        profileUserId,
        username !== undefined ? username.trim() : undefined,
        email !== undefined ? email.trim() : undefined,
        avatar,
        bio,
        headerPhoto
    );

    if (updatedUser === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    if (updatedUser === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Email kullanımda."
        });
    }

    if (updatedUser === "USERNAME_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Username kullanımda."
        });
    }

    return res.status(200).json({
        message: "Kullanıcı güncellendi.",
        data: updatedUser
    });
}

function deleteUser(req, res) {
    const profileUserId = req.params.id;
    const deletedUser = deleteUserService(profileUserId);

    if (deletedUser === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Kullanıcı silindi.",
        data: deletedUser
    });
}

function getPostsByUserId(req, res) {
    const profileUserId = req.params.id;
    const viewerUserId = req.user?.id;

    const posts = getPostsByUserIdService(profileUserId, viewerUserId);

    if (posts === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Kullanıcının postları getirildi.",
        data: posts
    });
}

function getCommentsByUserId(req, res) {
    const profileUserId = req.params.id;
    const viewerUserId = req.user?.id;

    const comments = getCommentsByUserIdService(profileUserId, viewerUserId);

    if (comments === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Kullanıcının yorumları getirildi.",
        data: comments
    });
}

function getProfilePostsByUserId(req, res) {
    const profileUserId = req.params.id;
    const viewerUserId = req.user?.id;

    const profilePosts = getProfilePostsByUserIdService(
        profileUserId,
        viewerUserId
    );

    if (profilePosts === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message: "Kullanıcının profil postları getirildi.",
        data: profilePosts
    });
}

function getProfileRepliesByUserId(req, res) {
    const viewerUserId = req.user?.id;
    const profileUserId = req.params.id;

    const profileReplies = getProfileRepliesByUserIdService(profileUserId, viewerUserId);

    if(profileReplies === "USER_NOT_FOUND") {
        return res.status(404).json({
            message : "Kullanıcı bulunamadı."
        });
    }

    return res.status(200).json({
        message : "Kullanıcının reply'ları getirildi",
        data : profileReplies
    });
}

module.exports = {
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
};