import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Customer, IUser } from "@/types";

// Create user
export async function createUser(user: IUser) {
  if (!user) {
    return;
  }

  const { chatId, firstName, lastName, username } = user;

  await connectMongoDB();

  const existingUser = await User.findOne({ chatId });

  if (existingUser) {
    existingUser.botUsed = existingUser.botUsed + 1;
    await existingUser.save();
    return;
  }

  const newUser = new User({
    chatId: chatId,
    username: username,
    firstName: firstName,
    lastName: lastName,
  });

  const savedUser = await newUser.save();
  console.log("test user", savedUser);
}
