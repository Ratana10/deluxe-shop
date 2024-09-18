import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function updateOrderPhoneNumber(
  orderId: string,
  phoneNumber: string
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { phoneNumber: phoneNumber },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

export async function updateOrderLocation(orderId: string, location: string) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { location: location },
    { new: true }
  );

  console.log("update order location", updatedOrder)

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

export async function getOrderByChatId(chatId: number) {
  await connectMongoDB();

  const order = await Order.findOne({ chatId: chatId }).exec();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}
