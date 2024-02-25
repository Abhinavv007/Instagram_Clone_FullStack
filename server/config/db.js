import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
 
    try {
        await mongoose.connect( `mongodb+srv://${process.env.MONGO_NAME}:${process.env.PASS}@cluster0.w7a5euh.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log("Database Connected"));
    } catch (error) {
        console.error("Error connecting to database:", error); 
    }
};

export default dbConnect;
