import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = "mongodb://127.0.0.1:27017/db_deluxe";

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connect to mongodb");
  } catch (error: any) {
    console.log(error);
  }
};
