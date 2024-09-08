import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose, { ObjectId } from "mongoose";

export async function createOrder(userId: string): Promise<string> {
  await connectMongoDB();

  const order = new Order({
    userId: userId,
    status: "Pending",
  });

  const savedOrder = await order.save();

  return savedOrder._id.toString();
}

export async function updateCustomerMessageId(
  orderId: string,
  cusMsgId: number
) {
  await connectMongoDB();
  const order = await Order.findById(orderId);
  if (!order) {
    return;
  }
  order.cusMsgId = cusMsgId;
  await order.save();
}

export async function getOrderById(orderId: string) {
  await connectMongoDB();
  return await Order.findById(orderId);
}

export async function updateOrderStatus(orderId: string, status: string) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: status },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}
