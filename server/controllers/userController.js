const { validateUsername, validatePassword, validateEmail } = require("../../utils/validation");
const {
    registerUserService,
    loginUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getPostsByUserIdService,
    getCommentsByUserIdService
} = require("../services/userService");

function registerUser(req, res) {
    const { username, password, email, avatar, bio } = req.body;

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const emailError = validateEmail(email);

    if (usernameError) {
        return res.status(400).json({
            message: usernameError
        });
    }

    if (passwordError) {
        return res.status(400).json({
            message: passwordError
        });
    }

    if (emailError) {
        return res.status(400).json({
            message: emailError
        });
    }

    const safeUser = registerUserService(
        username.trim(),
        email.trim(),
        password,
        avatar,
        bio
    );

    if (safeUser === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Bu email zaten kullanılıyor."
        });
    }

    if (safeUser === "USERNAME_ALREADY_EXISTS") {
        return res.status(409).json({
            message: "Bu username zaten kullanılıyor."
        });
    }

    return res.status(201).json({
        message: "Kullanıcı oluşturuldu.",
        data: safeUser
    });
}

function loginUser(req, res) {
    const { email, password } = req.body;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
        return res.status(400).json({
            message: emailError
        });
    }

    if (passwordError) {
        return res.status(400).json({
            message: passwordError
        });
    }

    const login = loginUserService(email.trim(), password);

    if (login === "USER_NOT_FOUND") {
        return res.status(404).json({
            message: "Kullanıcı bulunamadı."
        });
    }

    if (login === "INVALID_PASSWORD") {
        return res.status(401).json({
            message: "Şifre yanlış."
        });
    }

    return res.status(200).json({
        message: "Giriş başarılı.",
        data: login
    });
}

function getAllUsers(req, res) {
    const safeUsers = getAllUsersService();

    return res.status(200).json({
        message: "Kullanıcılar getirildi.",
        data: safeUsers
    });
}

function getUserById(req, res) {
    const { id } = req.params;
    const user = getUserByIdService(id);

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
    const id = req.params.id;
    const { username, email, avatar, bio } = req.body;

    if (username !== undefined) {
        const usernameError = validateUsername(username);

        if (usernameError) {
            return res.status(400).json({
                message: usernameError
            });
        }
    }

    if (email !== undefined) {
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }
    }

    const updatedUser = updateUserService(
        id,
        username !== undefined ? username.trim() : undefined,
        email !== undefined ? email.trim() : undefined,
        avatar,
        bio
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
    const id = req.params.id;

    const deletedUser = deleteUserService(id);

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
    const { id } = req.params;
    const posts = getPostsByUserIdService(id);

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
    const { id } = req.params;
    const comments = getCommentsByUserIdService(id);

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

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getPostsByUserId,
    getCommentsByUserId
};