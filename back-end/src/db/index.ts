import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(
      `${process.env.MONGODB_URI!}/${DB_NAME}`
    );
    console.log("MongoDB connected to host ", connection.host);
  } catch (error) {
    console.error("MongoDB connection Failed ", error);
    process.exit(1);
  }
}
