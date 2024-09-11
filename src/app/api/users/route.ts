import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId, username, firstName, lastName } = await req.json();

    await connectMongoDB();

    const existingUser = await User.findOne({ chatId });

    if (existingUser) {
      existingUser.botUsed = existingUser.botUsed + 1;
      await existingUser.save();
      return NextResponse.json({ message: "User already exists" });
    }

    const newUser = new User({
      chatId,
      username,
      firstName,
      lastName,
      botUsed: 1,
    });

    console.log("saved new user:", newUser);

    await newUser.save();

    return NextResponse.json({ message: "User saved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error saving user" }, { status: 500 });
  }
}
