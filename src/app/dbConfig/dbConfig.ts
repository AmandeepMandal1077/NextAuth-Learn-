import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connection established successfully.");
        });

        connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
