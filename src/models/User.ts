import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document {
  username: string;
  firstName: string;
  lastName: string;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    chatId: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
