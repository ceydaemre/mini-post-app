const { users } = require("../data/users");

function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Token bulunamadı."
        });
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token formatı."
        });
    }

    const token = parts[1];

    if (!token.startsWith("user-")) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token."
        });
    }

    const userId = Number(token.split("-")[1]);

    if (!userId) {
        return res.status(401).json({
            message: "Yetkisiz erişim.Geçersiz token."
        });
    }

    const user = users.find(user => user.id === userId);

   if(!user) {
        return res.status(401).json({
            message : "Yetkisiz erişim.Kullanıcı bulunamadı.",
        });
   }

    req.user = user;
    next();
}

module.exports = authMiddleware;
