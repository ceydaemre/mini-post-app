const { users } = require("../data/users");

function optionalAuthMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        req.user = null;
        return next();
    }

    const authorizationParts = authorizationHeader.split(" ");

    if (authorizationParts.length !== 2 || authorizationParts[0] !== "Bearer") {
        req.user = null;
        return next();
    }

    const token = authorizationParts[1];

    if (!token.startsWith("user-")) {
        req.user = null;
        return next();
    }

    const tokenUserId = Number(token.split("-")[1]);

    if (!tokenUserId) {
        req.user = null;
        return next();
    }

    const authenticatedUser = users.find(
        user => user.id === tokenUserId
    );

    if (!authenticatedUser) {
        req.user = null;
        return next();
    }

    req.user = authenticatedUser;
    next();
}

module.exports = optionalAuthMiddleware;