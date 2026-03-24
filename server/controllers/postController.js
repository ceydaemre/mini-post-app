const {createPostService, getAllPostsService, deletePostService, likePostService, getPostByIdService, updatePostService, addCommentService, getCommentsByPostIdService, deleteCommentService, updateCommentService, likeCommentService} = require("../services/postService");
const { validateContent, validateUsername, validateAvatar } = require("../utils/validation");

function createPost(req, res) {
    const {username, avatar, content} = req.body;

    const usernameError = validateUsername(username);
    const avatarError = validateAvatar(avatar);
    const contentError = validateContent(content);

    if(usernameError) {
        return res.status(400).json({ message: usernameError });
    }
    if(avatarError) {
        return res.status(400).json({ message: avatarError });
    }
    if(contentError) {
        return res.status(400).json({ message: contentError });
    }
    
    const newPost = createPostService(username.trim(), avatar.trim(), content.trim());
    return res.status(201).json({ message : "Post oluşturuldu.", data : newPost});
}

function getAllPosts(req, res) {
    const posts = getAllPostsService();
    return res.status(200).json({
        message : "Postlar getirildi.",
        data : posts
    });
}

function deletePost(req, res) {
    const id = req.params.id; // string döner servicete Number kullan.

    const deletedPost = deletePostService(id);

    if(!deletedPost) {
        return res.status(404).json({ message : "Post bulunamadı."});
    } 
    
    return res.status(200).json({message : "Post silindi.", data : deletedPost});
    
}

function likePost(req, res) {
    const id = req.params.id;
    const likedPost = likePostService(id);

    if(!likedPost) {
        return res.status(404).json({ message : "Post bulunamadı."});
    }
    return res.status(200).json({
        message : "Post beğenildi.",
        data : likedPost
    });

}

function getPostById(req, res) {
    const id = req.params.id;
    const post = getPostByIdService(id);

    if(!post) {
        return res.status(404).json({ message : "Post bulunamadı."});
    }
    return res.status(200).json({ 
        message : "Post getirildi.",
        data : post
    });
    
}

function updatePost(req, res) {
    const id = req.params.id;
    const {content}  = req.body;

    const contentError = validateContent(content);

    if(contentError) {
        return res.status(400).json({message : contentError});
    }

    const updatedPost = updatePostService(id, content.trim());

    if(!updatedPost) {
        return res.status(404).json({ message : "Post bulunamadı."});
    }
    return res.status(200).json({message : "Post güncellendi.", data : updatedPost});

}

function addComment(req, res) {
    const id = req.params.id;
    const { username, avatar, content } = req.body;

    const usernameError = validateUsername(username);
    const avatarError = validateAvatar(avatar);
    const contentError = validateContent(content);

    if(usernameError) {
        return res.status(400).json({ message: usernameError });
    }
    if(avatarError) {
        return res.status(400).json({ message: avatarError });
    }
    if(contentError) {
        return res.status(400).json({ message: contentError });
    }

    const newComment = addCommentService(
        id, 
        username.trim(), 
        avatar.trim(), 
        content.trim()
    );

    if(!newComment){
        return res.status(404).json({ message: "Post bulunamadı." });
    }

    return res.status(201).json({
        message: "Yorum eklendi.",
        data: newComment
    });
}

function getCommentsByPostId(req, res) {
    const id = req.params.id;
    const comments = getCommentsByPostIdService(id);

    if(!comments) {
        return res.status(404).json({
            message: "Post bulunamadı."
        });
    }

    return res.status(200).json({
        message : "Yorumlar getirildi.",
        data : comments
    });
}

function deleteComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const result = deleteCommentService(postId, commentId);

    if (result === "POST_NOT_FOUND") {
        return res.status(404).json({ message : "Post bulunamadı."});
    }

    if(result === "COMMENT_NOT_FOUND") {
        return res.status(404).json({ message : "Yorum bulunamadı."});
    }

    return res.status(200).json({
        message : "Yorum silindi.",
        data : result
    });

}

function updateComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { content } = req.body;

    const contentError = validateContent(content);

    if(contentError) {
        return res.status(400).json({message : contentError});
    }
    
    const result = updateCommentService(postId, commentId, content.trim());

    if(result === "POST_NOT_FOUND") {
        return res.status(404).json({ message : "Post bulunamadı."});
    }

    if(result === "COMMENT_NOT_FOUND") {
        return res.status(404).json({ message : "Yorum bulunamadı."})
    }

    return res.status(200).json({
        message : "Yorum güncellendi.",
        data : result
    });
}

function likeComment(req, res) {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const result = likeCommentService(postId, commentId);

    if(result === "POST_NOT_FOUND") {
        return res.status(404).json({ message : "Post bulunamadı."});
    }

    if(result === "COMMENT_NOT_FOUND"){
        return res.status(404).json({ message : "Yorum bulunamadı."});
    }

    return res.status(200).json({ 
        message : "Yorum beğenildi.",
        data : result
    });

}

module.exports = {createPost, getAllPosts, deletePost, likePost, getPostById, updatePost, addComment, getCommentsByPostId, deleteComment, updateComment, likeComment};