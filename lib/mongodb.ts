// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export const connectDB = async () => {
  // If we are already connected, don't do anything
  if (mongoose.connection.readyState >= 1) return;

  // Otherwise, try to connect
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Connection Error ❌", error);
  }
};