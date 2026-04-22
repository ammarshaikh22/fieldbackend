import mongoose from "mongoose";

const Connection = async () => {
    try {
        const connection  = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export default Connection;