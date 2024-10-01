import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Markup } from "telegraf";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { OrderDetail as IOrderDetail } from "@/types";
import OrderDetail from "@/models/OrderDetail";
import bot from "@/app/bot/bot";
import { format } from "date-fns";
import dedent from "dedent";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const { total, address, phoneNumber, orderDetails, queryId } = order;

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
      chatId: 123,
      total,
      location: address,
      phoneNumber,
      orderStatus: OrderStatus.AWAITING_CONFIRM,
      paymentStatus: PaymentStatus.PENDING,
      orderNumber,
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
      - Item: ${item.name}
      Qty: ${item.quantity}
      Amount: $${item.price * item.quantity}
    `
      )
      .join("\n");

    // Seller message
    const customerMessage = dedent(
      `
      ✨ You have placed an order:
      ${formattedCartItems}
      💵 Total: $${order.total}
      📦 Order: ${orderNumber}
      📅 Date : ${currentDate}
        `
    );

    // Bot

    const inlineKeyboard = Markup.inlineKeyboard([
      [{ text: "🟡 Pending", callback_data: "no_action" }],
    ]);

    await bot.telegram.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Successfully",
      input_message_content: { message_text: customerMessage },
      reply_markup: {
        inline_keyboard: inlineKeyboard.reply_markup.inline_keyboard,
      },
    });

    // Send message to shop's ower

    // Seller message
    const sellerMessage = dedent(
      `
          ✨ You have a new order:
          ${formattedCartItems}
          💵 Total: $${total}
          📦 Order: ${orderNumber}
          📅 Date : ${currentDate}
          location: ${address}
          payment: paid
    
          👤 UserDetail
          `
    );

    await bot.telegram.sendMessage( process.env.TELEGRAM_CHAT_ID!, sellerMessage)

    return NextResponse.json({ message: "Order created successfully" });
  } catch (error) {
    console.log("POST error", error);
    return NextResponse.json({ message: "ERROR:ORDER handling POST request" });
  }
}
