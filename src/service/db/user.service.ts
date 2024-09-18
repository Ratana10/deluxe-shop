import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function updateUserPhoneNumber(
  chatId: number,
  phoneNumber: string
) {
  await connectMongoDB();

  const updatedUser = await User.findOneAndUpdate(
    { chatId: chatId },
    { phoneNumber: phoneNumber },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
}
