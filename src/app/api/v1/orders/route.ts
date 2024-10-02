import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Markup } from "telegraf";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { IOrder, OrderDetail as IOrderDetail } from "@/types";
import OrderDetail from "@/models/OrderDetail";
import bot from "@/app/bot/bot";
import { format } from "date-fns";
import dedent from "dedent";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const {
      total,
      location,
      phoneNumber,
      orderDetails,
      queryId,
      chatId,
      address,
      deliveryFee,
      paymentMethod,
      subtotal,
    }: IOrder = order;

    console.log("order", order);

    await connectMongoDB();

    // Step 1: Generate the orderNumber (assuming you already implemented this logic)
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNumber" }, // Find the counter document by name
      { $inc: { seq: 1 } }, // Increment the sequence number
      { new: true, upsert: true } // Create a new counter if it doesn't exist
    );

    const seq = counter.seq;
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // e.g., 202409 for Sept 2024
    const orderNumber = `DELUXE${yearMonth}${String(seq).padStart(4, "0")}`; // e.g., DELUXE202409000

    const orderModel = new Order({
      chatId,
      total,
      location,
      phoneNumber,
      orderStatus: OrderStatus.AWAITING_CONFIRM,
      paymentStatus: PaymentStatus.PENDING,
      orderNumber,
      address,
      deliveryFee,
      paymentMethod,
      subtotal,
    });

    console.log("orderModel", orderModel);

    const savedOrder = await orderModel.save();

    // Create OrderDetail
    const orderDetailsData = orderDetails.map((item: IOrderDetail) => ({
      orderId: savedOrder._id,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    console.log("Order Details Prepared:", orderDetailsData);

    //Insert the orderdetails into the db
    const createdOrderDetails = await OrderDetail.insertMany(orderDetailsData);

    //Link the created order detail ids to the main order
    savedOrder.orderDetails = createdOrderDetails.map((detail) => detail._id);

    await savedOrder.save();

    console.log("Order and Order Details saved successfully");

    // Send message to telegram
    const currentDate = format(new Date(), "MM-dd-yyyy hh:mm:ss a");

    const formattedCartItems = order.orderDetails
      .map(
        (item: any) => `
      Item: ${item.name}
      Qty: ${item.quantity}
      Amount: $${item.price * item.quantity}
    `
      )
      .join("\n");

    // Seller message
    const orderSuccess = "✅ Order Placed successfully";
    const customerMessage = dedent(
      `
      🧾 You have placed an order:
      ${formattedCartItems}
      🛵 Delivery fee: ${deliveryFee.toFixed(2)}
      💰 Subtotal: ${subtotal.toFixed(2)}
      💵 Total: $${total.toFixed(2)}
      📦 Order: ${orderNumber}
      💳 Payment: ${paymentMethod}
      📅 Date : ${currentDate}
      📞 phone: ${phoneNumber}
      📍 address: ${address}
        `
    );

    // Bot
    await bot.telegram.answerWebAppQuery(queryId!, {
      type: "article",
      id: queryId!,
      title: "Successfully",
      input_message_content: { message_text: orderSuccess },
    });

    const customerMsg = await bot.telegram.sendMessage(
      chatId!, // Customer's Telegram chat ID
      customerMessage,
      Markup.inlineKeyboard([
        [{ text: "🟡 Order Pending", callback_data: "no_action" }],
      ])
    );

    await bot.telegram.sendMessage(
      chatId!,
      dedent(
        `
        Thank you for placing the orders.
        We would love to inform you that it might take around a half day to 2 days for you to get the items.
        If you have any problem, 
        Please kindly direct massage to the shop's owner
        `
      )
    );

    // console.log("customer message id", cusMsgId)
    // Update the saved order with customer message ID
    savedOrder.cusMsgId = customerMsg.message_id;
    savedOrder.save();
    // Send message to shop's ower

    // Seller message
    const sellerMessage = dedent(
      `
      🚀 You have a new order:
      ${formattedCartItems}
      🛵 Delivery fee: ${deliveryFee.toFixed(2)}
      💰 Subtotal: ${subtotal.toFixed(2)}
      💵 Total: $${total.toFixed(2)}
      📦 Order: ${orderNumber}
      💳 Payment: ${paymentMethod}
      📅 Date : ${currentDate}
      📞 phone: ${phoneNumber}
      📍 address: ${address}
      🧭 location: ${location}
      `
    );

    await bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT_ID!, // Seller's chat ID from environment variables
      sellerMessage,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `❌ Reject`,
            `reject_order:${chatId}:${savedOrder._id}`
          ),
          Markup.button.callback(
            `✅ Confirm`,
            `confirm_order:${chatId}:${savedOrder._id}`
          ),
        ],
      ])
    );

    return NextResponse.json({ message: "Order created successfully" });
  } catch (error) {
    console.log("POST error", error);
    return NextResponse.json({ message: "ERROR:ORDER handling POST request" });
  }
}
