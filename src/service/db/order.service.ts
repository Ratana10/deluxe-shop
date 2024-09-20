import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function updateOrderPhoneNumber(
  orderId: string,
  phoneNumber: string,
  step: string
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { phoneNumber: phoneNumber, currentStep: step },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

export async function updateOrderLocation(orderId: string, location: string, step: string) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { location: location, currentStep: step },
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

export async function getOrderById(orderId: string) {
  await connectMongoDB();
  return await Order.findById(orderId);
}
