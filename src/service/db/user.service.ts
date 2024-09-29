import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Customer } from "@/types";

// Create user
export async function createUser(customer: Customer) {
  if (!customer) {
    return;
  }

  await connectMongoDB();

  const existingUser = await User.findOne({ chatId: customer.chatId });

  if (existingUser) {
    existingUser.botUsed = existingUser.botUsed + 1;
    await existingUser.save();
    return;
  }

  console.log("Create user", customer);

  const newUser = new User({
    chatId: customer.chatId,
    username: customer.username,
    firstName: customer.firstName,
    lastName: customer.lastName,
    botUsed: 1,
    phoneNumber: "",
  });

  const user = await newUser.save();
  console.log("test user", user);
}
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
