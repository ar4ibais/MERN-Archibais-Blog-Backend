import Comment from "../models/Comment.js"
import Post from "../models/Post.js";


export const AddComment = async (req, res) => {
    try {
        const postId = req.params.postId;
    
        const newComment = new Comment({
          text: req.body.text,
          user: req.userId,
          post: postId,
        })
    
        const savedComment = await newComment.save();

        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    
        res.json(savedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не удалось добавить комментарий' });
    }
}

export const GetComments = async (req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await Comment.find({ post: postId }).populate('user', 'fullName avatarUrl').exec();

        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не удалось получить комментарии' });      
    }
}