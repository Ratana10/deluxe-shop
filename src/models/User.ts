import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document {
  username: string;
  firstName: string;
  lastName: string;
  chatId: number;
  botUsed: number;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    chatId: { type: Number, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    botUsed: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
