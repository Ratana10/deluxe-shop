import { connectMongoDB } from "@/lib/mongodb";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import OrderDetail from "@/models/OrderDetail";
import { CartItem } from "@/types";
import { OrderStatus, PaymentStatus } from "@/types/enums";

export async function createOrder(
  chatId: string,
  cart: CartItem[]
){
  try {
    await connectMongoDB();

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

     // Step 1: Generate the orderNumber (assuming you already implemented this logic)
     const counter = await Counter.findOneAndUpdate(
      { name: "orderNumber" },        // Find the counter document by name
      { $inc: { seq: 1 } },           // Increment the sequence number
      { new: true, upsert: true }     // Create a new counter if it doesn't exist
    );

    const seq = counter.seq;
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // e.g., 202409 for Sept 2024
    const orderNumber = `DELUXE${yearMonth}${String(seq).padStart(4, "0")}`;  // e.g., DELUXE202409000

    console.log("Order number", orderNumber)
    const order = new Order({
      chatId,
      orderStatus: OrderStatus.PENDING,
      total: totalPrice,
      paymentStaus: PaymentStatus.PENDING,
      location: "",
      orderNumber: orderNumber
    });

    console.log("Order", order)

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
      orderNumber: orderNumber
    }
    // return savedOrder._id.toString();

  } catch (error) {
    console.log("ERROR while creating order");
    return null;
  }
}

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

export async function getOrderById(orderId: string) {
  await connectMongoDB();
  return await Order.findById(orderId);
}

export async function updateOrderStatus(orderId: string, status: string) {
  await connectMongoDB();

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
}

export async function updatePaymentStatus(
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
