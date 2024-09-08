import bot from "@/app/bot/bot";
import { Markup } from "telegraf";
import dedent from "dedent";
import { CartItem } from "@/types";

const TELEGRAM_CHAT_ID = "1042969274"; //Seller's chat ID
const USER_CHAT_ID = "7116786291"; //Customer's chat id
export async function GET() {
  return new Response("This is the Telegram notification API", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    const formattedCartItems = cart
      .map((item: CartItem) =>
        dedent(`
      -Item ${item.name}
      Qty: ${item.quantity}
      Amount: $ ${item.price * item.quantity}
      `)
      )
      .join("\n\n"); //Line break for spacing between items

    const totalPrice = cart
      .reduce(
        (total: number, item: { quantity: number; price: number }) =>
          total + item.quantity * item.price,
        0
      )
      .toFixed(2);

    // Template literal for seller message
    const sellerMessage = dedent(`
      You have new Order:

      ${formattedCartItems}

      Total: $${totalPrice}
      
      `);

    // Template literal for customer message
    const customerMessage = dedent(`
      Your order:

      ${formattedCartItems}

      Total: $ ${totalPrice}
      Status: Pending
      `);

    await bot.telegram.sendMessage(
      TELEGRAM_CHAT_ID,
      sellerMessage,
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Confirm", "confirm_order")],
        [Markup.button.callback("❌ Reject", "reject_order")],
      ])
    );

    await bot.telegram.sendMessage(
      USER_CHAT_ID!,
      customerMessage,
      Markup.inlineKeyboard([
        [{ text: "🟡 Pending", callback_data: "no_action" }],
      ])
    );

    return new Response("Message with buttons sent to Telegram", {
      status: 200,
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response("Failed to process request", { status: 500 });
  }
}
