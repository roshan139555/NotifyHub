import {Post} from "../models/post.schema.js"
import {sendMessage} from "../kafka/producer.js"

const createPost = async(req,res) =>{
    try {
        
        const {content} =  req.body;
        if(!content || content.trim() == ""){
            return res.status(400).json({
                success: false,
                message:" Post Content is Required.",
            });
        }
        const post = await Post.create({
            content,
            author: req.user._id,
        });

        return res.status(200).json({
            success:true,
            message: "Post Created Successfully .",
            data: post,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:"Technical Problem",
            error:error.message,
        });
    }
}

const getAllPost = async(req,res) =>{
    try {
        const posts = await Post.find().populate("author","fullname username avatar").populate({path:"comments", populate:{path:"author", select:"fullname username avatar"}}).sort({createdAt: -1});
    res.status(200).json({
        success: true,
        message: "Posts Fetched Successfully.",
        data: posts,
    });
        
    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Technical Error",
        error: error.message,
       }); 
    } 
};

const postById = async (req,res) => {
    try {
        const posts = await Post.findById(req.params.id).populate("author","fullname username avatar").populate({path:"comments", populate:{path:"author", select:"fullname username avatar"}});

        if(!posts){
            return res.status(400).json({
                success:false,
                message: "Post Not Found .",
            });
        }
        return res.status(200).json({
            success:true,
            message: "Post Found",
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Techincal Problem",
            error: error.message,
        })
    }
};
const updatePost = async(req,res) =>{
    try {
        const {content} = req.body;
        if(!content || content.trim() == ""){
            return res.status(400).json({
                success: false,
                message: "Content Not Available",
            });
        }
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({
                success:false,
                message:"No Such post Found.",
            });
        }
        
        if(post.author.toString() !== req.user._id.toString()){
            return res.status(500).json({
                success: false,
                message: "You are not authorized to update the post.",
            });
        }
        post.content = content;
        await post.save();

        return res.status(200).json({
            success:true,
            message:"Post has been updated,",
            data: post,
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Techincal Problem",
            error: error.message,
        })
    }
}
const deletePost = async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({
                success:false,
                message:"No Such Post Available",
            });
        }
        if(post.author.toString() != req.user._id.toString()){
            return res.status(400).json({
                success:false,
                message: "You are not authorized to delete this Post.",
            });
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success:true,
            message: " Post Has Been Deleted Successfully.",
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"technical problem.",
            error: error.message,
        }
        )
    }
}
const toggleLike = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"No Such Post Found.",
            });
        }

        const alreadyLiked = post.likes.some(
            (id)=>id.toString() === req.user._id.toString()
        );

        if(alreadyLiked){
            post.likes = post.likes.filter(
                (id)=>id.toString() !== req.user._id.toString()
            );
        }
        else{
            post.likes.push(req.user._id);
        }

        await post.save();

        if(!alreadyLiked){
            await sendMessage("post-liked", {
                userId:req.user._id,
                postId:post._id,
                postOwnerId:post.author,
            });
        }

        return res.status(200).json({
            success:true,
            message: alreadyLiked ? "Post Unliked Successfully." : "Post Liked Successfully.",
            likesCount:post.likes.length,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Technical Problem.",
            error: error.message,
        });
    }
}

export {createPost,getAllPost,postById,updatePost,deletePost,toggleLike};