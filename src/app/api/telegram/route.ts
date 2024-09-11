import bot from "@/app/bot/bot";
import { Markup } from "telegraf";
import dedent from "dedent";
import { createOrder, updateCustomerMessageId } from "@/service/order.service";
import { format } from "date-fns";
import User from "@/models/User";

export async function POST(req: Request, res: Response) {
  try {
    const { cart, chatId } = await req.json();

    if (!cart) {
      return new Response(JSON.stringify({ message: "missing cart" }), {
        status: 400,
      });
    }

    //Save cart into db
    const orderId = await createOrder(chatId, cart);

    const formattedCartItems = cart
      .map(
        (item: any) => `
      - Item: ${item.name}
      Qty: ${item.quantity}
      Amount: $${item.price * item.quantity}
    `
      )
      .join("\n");

    const totalPrice = cart
      .reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      )
      .toFixed(2);

    const currentDate = format(new Date(), "MM-dd-yyyy hh:mm:ss a");

    const user = await User.findOne({ chatId });

    console.log("user ", user);

    // Seller message
    const sellerMessage = dedent(
      `
      ✨ You have a new order:
      ${formattedCartItems}
      💵 Total: $${totalPrice}
      📦 Order ID: ${orderId}
      📅 Date: ${currentDate}

      👤 UserDetail
      username: ${user.username}
      firstname: ${user.firstName}
      lastname: ${user.lastName}
      `
    );

    // Seller message
    const customerMessage = dedent(
      `
      ✨ You have placed an order:
      ${formattedCartItems}
      💵 Total: $${totalPrice}
      📦 Order ID: ${orderId}
      📅 Date: ${currentDate}

      📞 Contact Seller: 0964347813
      Please wait ...
        `
    );

    // Send message to seller with confirmation buttons
    await bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT_ID!, // Seller's chat ID from environment variables
      sellerMessage,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `❌ Reject`,
            `reject_order:${chatId}:${orderId}`
          ),
          Markup.button.callback(
            `✅ Confirm`,
            `confirm_order:${chatId}:${orderId}`
          ),
        ],
      ])
    );

    // Send message to customer
    const customerMsg = await bot.telegram.sendMessage(
      chatId!, // Customer's Telegram chat ID
      customerMessage,
      Markup.inlineKeyboard([
        [{ text: "🟡 Pending", callback_data: "no_action" }],
      ])
    );

    const cusMsgId = customerMsg.message_id;

    //update the order with customer msgId
    await updateCustomerMessageId(orderId, cusMsgId);

    return new Response(
      JSON.stringify({
        message: "Order created and Telegram message sent successfully",
      })
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
