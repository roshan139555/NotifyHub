import mongoose from "mongoose"

const connectDb = async (mongoUri = process.env.MONGODB_URI || process.env.MONDOGB_URI) => {
    try {
        const connectionInstance = await mongoose.connect(mongoUri)
        console.log(`\n Mongodb Connected Successfully !! DB HOST:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed", error);
        throw error;
    }
}
export default connectDb
