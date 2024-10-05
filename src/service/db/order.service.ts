import { connectMongoDB } from "@/lib/mongodb";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import { CartItem } from "@/types";
import {
  IOrderStatus,
  IPaymentStatus,
  OrderStatus,
  PaymentStatus,
} from "@/types/enums";
import OrderDetail from "@/models/OrderDetail";

// Create new order
export async function createOrder(chatId: string, cart: CartItem[]) {
  try {
    await connectMongoDB();

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Step 1: Generate the orderNumber (assuming you already implemented this logic)
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNumber" }, // Find the counter document by name
      { $inc: { seq: 1 } }, // Increment the sequence number
      { new: true, upsert: true } // Create a new counter if it doesn't exist
    );

    const seq = counter.seq;
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // e.g., 202409 for Sept 2024
    const orderNumber = `DELUXE${yearMonth}${String(seq).padStart(4, "0")}`; // e.g., DELUXE202409000

    const order = new Order({
      chatId,
      orderStatus: OrderStatus.AWAITING_CONFIRM,
      total: totalPrice,
      paymentStaus: PaymentStatus.PENDING,
      location: "",
      orderNumber: orderNumber,
    });

    console.log("Order", order);

    const savedOrder = await order.save();

    // Create OrderDetail
    const orderDetails = cart.map((item: CartItem) => ({
      orderId: savedOrder._id,
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    //Insert the orderdetails into the db
    const createdOrderDetails = await OrderDetail.insertMany(orderDetails);

    //Link the created order detail ids to the main order
    savedOrder.orderDetails = createdOrderDetails.map((detail) => detail._id);

    await savedOrder.save();

    return {
      orderId: savedOrder._id.toString(),
      orderNumber: orderNumber,
    };
    // return savedOrder._id.toString();
  } catch (error) {
    return null;
  }
}

// Update customer message UI
export async function updateCustomerMessageId(
  orderId: string,
  cusMsgId: number
) {
  await connectMongoDB();
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { cusMsgId: cusMsgId },
    { new: true }
  );
  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

// Update ordered phone number
export async function updateOrderStatus(
  orderId: string,
  orderStatus: IOrderStatus
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

export const updateRejectedReason = async (orderId: string, reason: string) => {
  await connectMongoDB();
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { reason: reason, orderStatus: IOrderStatus.REJECT },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }
};

export const getAllOrdersByUserId = async (userId: number) => {
  try {
    const orders = await Order.find({ user: userId }).populate("orderDetails");
    return orders;
  } catch (error) {
    console.error("Error fetching orders by chatId: ", error);
    throw new Error("Failed to fetch orders.");
  }
};
