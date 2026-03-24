function validateContent(content) {
    if (!content || content.trim() === "") {
        return "İçerik boş bırakılamaz.";
    }

    if (content.trim().length > 280) {
        return "İçerik 280 karakterden uzun olamaz.";
    }

    return null;
}

function validateUsername(username) {
    if(!username || username.trim() === "") {
        return "Username boş bırakılamaz."
    }
    return null;
}

function validateAvatar(avatar) {
    if (!avatar || avatar.trim() === "") {
        return "Avatar boş bırakılamaz.";
    }
    return null;
}

module.exports = {
    validateContent,
    validateUsername,
    validateAvatar
};