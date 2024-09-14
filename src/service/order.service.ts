import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderDetail from "@/models/OrderDetail";
import { CartItem } from "@/types";

export async function createOrder(
  userId: string,
  cart: CartItem[]
): Promise<string> {
  await connectMongoDB();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const order = new Order({
    userId: userId,
    status: "Pending",
    total: totalPrice,
  });

  const savedOrder = await order.save();

  //Create OrderDetail

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

  return savedOrder._id.toString();
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
