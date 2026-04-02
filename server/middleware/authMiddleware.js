const { users } = require("../data/users");

function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Token bulunamadı."
        });
    }

    const authorizationParts = authorizationHeader.split(" ");

    if (authorizationParts.length !== 2 || authorizationParts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token formatı."
        });
    }

    const token = authorizationParts[1];

    if (!token.startsWith("user-")) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token."
        });
    }

    const tokenUserId = Number(token.split("-")[1]);

    if (!tokenUserId) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token."
        });
    }

    const authenticatedUser = users.find(
        user => user.id === tokenUserId
    );

    if (!authenticatedUser) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Kullanıcı bulunamadı."
        });
    }

    req.user = authenticatedUser;
    next();
}

module.exports = authMiddleware;