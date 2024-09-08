import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(params: Request) {
  await connectMongoDB();

  const userId = "123",
    customoerMessageId = 123;

  const newOrder = new Order({
    userId,
    customoerMessageId,
    status: "Pending",
  });

  await newOrder.save();

  console.log("Order saved");

  return new Response("success");
}
