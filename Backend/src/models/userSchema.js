import mongoose from "mongoose"
import { Schema } from "mongoose"

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        lowercase: true

    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is Required ."]
    },
    avatar: {
        type: String,
        default: "https://share.google/zweCJ0AKmWcbQcsls"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, {
    timestamps: true
}
)

export const User = mongoose.model('User',userSchema);