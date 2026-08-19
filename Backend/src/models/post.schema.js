import mongoose from "mongoose"
import {Schema} from "mongoose"

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
        
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },],
},{
    timestamps: true,
}
);


export const Post = mongoose.model("Post", postSchema);