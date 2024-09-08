import bot from "@/app/bot/bot";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await bot.handleUpdate(body);
    return NextResponse.json({});
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
