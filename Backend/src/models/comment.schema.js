import mongoose from "mongoose"
import { Schema } from "mongoose"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
}, {
    timestamps: true,
})

export const Comment = mongoose.model("Comment", commentSchema);
