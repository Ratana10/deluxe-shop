import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: chatId } = params;

  //Connect to mongodb

  await connectMongoDB();

  const user = await User.findOne({ chatId });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
