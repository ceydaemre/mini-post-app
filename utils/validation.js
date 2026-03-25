function validateContent(content) {
    if (!content || content.trim() === "") {
        return "İçerik boş bırakılamaz.";
    }

    if (content.trim().length > 280) {
        return "İçerik 280 karakterden uzun olamaz.";
    }

    return null;
}


function validateAvatar(avatar) {
    if (!avatar || avatar.trim() === "") {
        return "Avatar boş bırakılamaz.";
    }
    return null;
}

function validateEmail(email) {
    if(!email || email.trim() === "") {
        return "Email boş bırakılamaz.";
    }
    return null;
}

function validateUsername(username) {
    if(!username || username.trim() === "") {
        return "Username boş bırakılamaz."
    }

    return null;
}

function validatePassword(password) {
    if(!password || password.trim() === "") {
        return "Şifre boş bırakılamaz.";
    }
    if(password.trim().length < 6) {
        return "Şifre 6 karakterden kısa olamaz."
    }

    return null;
}

module.exports = {
    validateContent,
    validateAvatar,
    validateEmail,
    validateUsername,
    validatePassword
};