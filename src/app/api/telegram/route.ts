import bot from "@/app/bot/bot";
import { Markup } from "telegraf";
import dedent from "dedent";
import { CartItem } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { createOrder, updateCustomerMessageId } from "@/service/order.service";
import { format } from "date-fns";

const TELEGRAM_CHAT_ID = "1042969274"; //Seller's chat ID
const USER_CHAT_ID = "7116786291"; //Customer's chat id

export async function POST(req: Request, res: Response) {
  try {
    const { cart } = await req.json();

    if (!cart) {
      return new Response(JSON.stringify({ message: "missing cart" }), {
        status: 400,
      });
    }

    //Save cart into db
    const orderId = await createOrder(USER_CHAT_ID);

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

    const currentDate = format(new Date(), "MMMM do, yyyy hh:mm:ss a");

    // Seller message
    const sellerMessage = dedent(
      `
      ✨You have a new order:
      ${formattedCartItems}
      
      Total: $${totalPrice}

      📅 Date: ${currentDate}
      `
    );

    // Seller message
    const customerMessage = dedent(
      `
        ✨You have order:
        ${formattedCartItems}
        
        Total: $${totalPrice}

        📅 Date: ${currentDate}
        `
    );

    // Send message to seller with confirmation buttons
    await bot.telegram.sendMessage(
      TELEGRAM_CHAT_ID!, // Seller's chat ID from environment variables
      sellerMessage,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `✅ Confirm`,
            `confirm_order:${USER_CHAT_ID}:${orderId}`
          ),
        ],
        [
          Markup.button.callback(
            `❌ Reject`,
            `reject_order:${USER_CHAT_ID}:${orderId}`
          ),
        ],
      ])
    );

    // Send message to customer
    const customerMsg = await bot.telegram.sendMessage(
      USER_CHAT_ID, // Customer's Telegram chat ID
      customerMessage,
      Markup.inlineKeyboard([
        [{ text: "🟡 Pending", callback_data: "no_action" }],
      ])
    );

    const cusMsgId = customerMsg.message_id;

    //update the order with customer msgId
    await updateCustomerMessageId(orderId, cusMsgId);

    console.log("Cart", cart);
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
