const { users } = require("../data/users");

function optionalAuthMiddleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        req.user = null;
        return next();
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        req.user = null;
        return next();
    }

    const token = parts[1];

    if (!token.startsWith("user-")) {
        req.user = null;
        return next();
    }

    const userId = Number(token.split("-")[1]);

    if (!userId) {
        req.user = null;
        return next();
    }

    const user = users.find(user => user.id === userId);

    if (!user) {
        req.user = null;
        return next();
    }

    req.user = user;
    next();
}

module.exports = optionalAuthMiddleware;