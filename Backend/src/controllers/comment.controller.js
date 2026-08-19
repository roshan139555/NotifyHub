import { Comment } from "../models/comment.schema.js"
import { Post } from "../models/post.schema.js"
import { sendMessage } from "../kafka/producer.js"

const createComment = async(req,res) =>{
    try {
        const {content} = req.body

        if(!content || content.trim() == ""){
            return res.status(400).json({
                success:false,
                message:"Comment Content is Required.",
            })
        }

        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"No Such Post Found.",
            })
        }

        const comment = await Comment.create({
            content,
            author:req.user._id,
            post:post._id,
        })

        post.comments.push(comment._id)
        await post.save()

        await sendMessage("post-commented", {
            userId:req.user._id,
            postId:post._id,
            postOwnerId:post.author,
            commentId:comment._id,
        })

        const createdComment = await Comment.findById(comment._id)
            .populate("author", "fullname username avatar")

        return res.status(201).json({
            success:true,
            message:"Comment Added Successfully.",
            data:createdComment,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

const getPostComments = async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"No Such Post Found.",
            })
        }

        const comments = await Comment.find({post:post._id})
            .populate("author", "fullname username avatar")
            .sort({createdAt:-1})

        return res.status(200).json({
            success:true,
            message:"Comments Fetched Successfully.",
            data:comments,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

const deleteComment = async(req,res) =>{
    try {
        const comment = await Comment.findById(req.params.id)

        if(!comment){
            return res.status(404).json({
                success:false,
                message:"Comment Not Found.",
            })
        }

        if(comment.author.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this comment.",
            })
        }

        await Post.findByIdAndUpdate(comment.post, {
            $pull:{comments:comment._id}
        })

        await Comment.findByIdAndDelete(comment._id)

        return res.status(200).json({
            success:true,
            message:"Comment Deleted Successfully.",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

export {createComment,getPostComments,deleteComment}
