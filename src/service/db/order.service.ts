import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { OrderStatus, PaymentStatus } from "@/types/enums";

// Update ordered phone number
export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: orderStatus },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

// Update ordered phone number
export async function updateOrderPhoneNumber(
  orderId: string,
  phoneNumber: string,
  orderStatus: OrderStatus
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { phoneNumber: phoneNumber, orderStatus: orderStatus },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

// Update ordered location
export async function updateOrderLocation(
  orderId: string,
  location: string,
  orderStatus: OrderStatus
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { location: location, orderStatus: orderStatus },
    { new: true }
  );

  console.log("update order location", updatedOrder);

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

// Get ordered by ChatId
export async function getOrderByChatId(chatId: number) {
  await connectMongoDB();

  const order = await Order.findOne({ chatId: chatId }).exec();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

// Get ordered by orderId
export async function getOrderById(orderId: string) {
  await connectMongoDB();
  return await Order.findById(orderId);
}

// Update ordered Payment
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: paymentStatus },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}
