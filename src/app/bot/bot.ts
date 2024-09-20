import { Context, Markup, session, Telegraf } from "telegraf";
import { handleRejectOrder } from "./botAction";
import dotenv from "dotenv";
import { saveUser } from "@/service/user.service";
import { OrderStatus, OrderStep, PaymentStatus } from "@/types/enums";
import { updatePaymentStatus } from "@/service/bot/order.service";
import dedent from "dedent";
import { getOrderById, updateOrderStatus } from "@/service/order.service";
import {
  updateOrderLocation,
  updateOrderPhoneNumber,
} from "@/service/db/order.service";

// Bot type

export interface SessionData {
  orderId?: string;
  messageCount: number;
}

export interface CustomContext extends Context {
  session: SessionData;
  match?: RegExpExecArray;
}

// Load environment variables from .env
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_LINK = process.env.NEXT_PUBLIC_API_BASE_URL;
const WEBHOOK_URL = `${WEB_LINK}/api/webhook`;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

console.log("BOT Starting...");

const bot = new Telegraf<CustomContext>(BOT_TOKEN);

// Apply session middleware
bot.use(session());

bot.telegram.setMyCommands([
  { command: "/start", description: "Start placing an order" },
  { command: "/help", description: "Display the list of available command" },
  { command: "/contactsupport", description: "Contact support for help" },
]);

bot.start(async (ctx) => {
  // Simulate typing to make it feel more interactive
  await ctx.sendChatAction("typing");
  await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second

  const webUrl = `${WEB_LINK}?chat_id=${ctx.chat.id}`;
  const telegrafUser = ctx.from;

  //Personalized Welcome message
  await ctx.reply(
    `Hello ${
      telegrafUser.first_name || "there"
    }! ⭐\nReady to place an order!!`,
    Markup.inlineKeyboard([[Markup.button.url("Start Order website", webUrl)]])
  );

  //save user
  const userData = {
    chatId: ctx.chat.id,
    username: telegrafUser.username || "Unknow",
    firstName: telegrafUser.first_name || "",
    lastName: telegrafUser.last_name || "",
    phoneNumber: "",
  };

  await saveUser(userData);
});

bot.action(/confirm_order:(.+):(.+)/, async (ctx) => {
  // await handleConfirmOrder(ctx);
  const [chatId, orderId] = ctx.match.slice(1);

  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [{ text: "✅ Confirmed", callback_data: "confirm_order" }],
    ],
  });

  const { cusMsgId } = await getOrderById(orderId);

  if (!cusMsgId) {
    console.error("cusMsgId", cusMsgId, orderId);
    throw new Error("cusMsgId id not found");
  }

  //update customer chat Pending to Confirm
  await bot.telegram.editMessageReplyMarkup(chatId, cusMsgId, undefined, {
    inline_keyboard: [[{ text: "🟢 Confirm", callback_data: "no_action" }]],
  });

  //Update Order Status
  let order = await updateOrderStatus(
    orderId,
    OrderStatus.CONFIRMED,
    OrderStep.AWAITING_PHONE
  );

  // Ask the user to type their phone number instead of sharing it
  await bot.telegram.sendMessage(
    chatId,
    `Please type your phone number example: 096888888`
  );

  bot.on("text", async (ctx) => {
    const chatId = String(ctx.message.chat.id);
    const userInput = ctx.message?.text;

    if (!userInput) {
      return;
    }

    // Get order
    order = await getOrderById(orderId);
    console.log("ORder test", order);

    if (order.currentStep === OrderStep.AWAITING_PHONE) {
      if (validatePhoneNumber(userInput)) {
        await ctx.reply(`Thank you! Your phone number has been recorded.`);
        await updateOrderPhoneNumber(
          orderId,
          userInput,
          OrderStep.AWAITING_LOCATION
        );
        await ctx.reply(`Please type in your location for delivery.`);
      } else {
        await ctx.reply(
          `The phone number you entered is invalid. Please try again.`
        );
      }
    } else if (order.currentStep === OrderStep.AWAITING_LOCATION) {
      await updateOrderLocation(orderId, userInput, OrderStep.COMPLETED);
      await ctx.reply(`Thank you! Your location has been set to ${userInput}.`);

      await bot.telegram.sendMessage(
        chatId!, // Customer's Telegram chat ID
        `How would you like to pay?`,
        Markup.inlineKeyboard([
          [
            {
              text: "🚚 Pay via delivery",
              callback_data: `pay_delivery:${chatId}:${orderId}`,
            },
            {
              text: "🏦 Pay via bank",
              callback_data: `pay_bank:${chatId}:${orderId}`,
            },
          ],
        ])
      );
    }
  });
});

// Helper function to validate phone number
function validatePhoneNumber(phoneNumber: string) {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
}

bot.action(/reject_order:(.+):(.+)/, async (ctx) => {
  await handleRejectOrder(ctx);
});

bot.action(/pay_delivery:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);
  await ctx.reply(
    dedent(
      `
      Thank you for placing the orders.
      We would love to inform you that 
      it might take around a half day to 2 days 
      for you to get the items.

      If you have any problem, 
      Please kindly direct massage to the shop's owner
      `
    )
  );
});

bot.action(/pay_bank:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/aba_qr.jpg?v=${new Date().getTime()}`;

  const order = await getOrderById(orderId);

  // Simulate typing to make it feel more interactive
  await ctx.sendChatAction("upload_photo");
  await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second

  await ctx.telegram.sendPhoto(chatId, imageUrl, {
    caption: dedent(`
        📷 Here is our ABA QR.
        
        📝 Please transfer the total amount of $ ${order.total}  
        and send the transaction receipt 
        in this chat once the payment is completed.
      `),
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ Already pay",
            callback_data: `confirm_payment:${chatId}:${orderId}`,
          },
        ],
      ],
    },
  });
});

// Stop using
bot.action(/confirm_payment:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);

  await ctx.reply(`Please send transaction receipt.`);

  // Set up listener for photo upload
  bot.on("photo", async (ctx) => {
    const photoId = ctx.message.photo[0].file_id;

    await ctx.reply(
      "Transaction receipt uploaded successfully. We will notify the shop's ower to verify your transaction."
    );

    // Send the transaction photo to the seller for verification
    if (!TELEGRAM_CHAT_ID) {
      throw new Error("error");
    }

    await ctx.telegram.sendPhoto(TELEGRAM_CHAT_ID, photoId, {
      caption: `Order ID: ${orderId}\nA customer has uploaded a transaction receipt for verification.`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Verify Transaction",
              callback_data: `verify_transaction:${chatId}:${orderId}`,
            },
            {
              text: "❌ Reject Transaction",
              callback_data: `reject_transaction:${chatId}:${orderId}`,
            },
          ],
        ],
      },
    });
  });
});

bot.action(/verify_transaction:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);

  // Update button to verify
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [{ text: "✅ Verified", callback_data: "verify_transaction" }],
    ],
  });

  console.log("ChatID", chatId);
  console.log("OrderID", orderId);

  // Find the order in the database
  const order = await updatePaymentStatus(orderId, PaymentStatus.COMPLETED);

  // Notify the customer that the payment has been verified
  await ctx.telegram.sendMessage(
    chatId,
    dedent(
      `
      Thank you for placing the orders.
      We would love to inform you that 
      it might take around a half day to 2 days 
      for you to get the items.

      If you have any problem, 
      Please kindly direct massage to the shop's owner
      `
    )
  );
});

// Command ask for support
bot.command("contactsupport", async (ctx) => {
  await ctx.reply(
    dedent(`
    If you have any problems, Please kindly direct message to the shop's ower

    📱 Phone Number: +855 61 664 996
    `),
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📸 Instagram",
              url: "https://instagram.com/yourInstagramHandle",
            },
            {
              text: "💬 Telegram",
              url: "https://t.me/chanminea_sarann",
            },
          ],
        ],
      },
    }
  );
});

// Set the webhook only in production and avoid during build
if (process.env.NODE_ENV === "production") {
  if (process.env.WEBHOOK_URL) {
    // Ensure this is only run once when the app is live
    bot.telegram
      .setWebhook(`${process.env.WEBHOOK_URL}`)
      .then(() => console.log("Webhook set successfully!"))
      .catch((err) => {
        if (err.response && err.response.error_code === 429) {
          const retryAfter = err.response.parameters.retry_after;
          console.error(`Too Many Requests: retry after ${retryAfter} seconds`);
          setTimeout(() => {
            bot.telegram.setWebhook(WEBHOOK_URL).catch(console.error);
          }, retryAfter * 1000);
        } else {
          console.error("Failed to set webhook:", err);
        }
      });
  } else {
    console.error("WEBHOOK_URL is not defined.");
  }
} else {
  // In development or non-production, use long polling
  bot
    .launch()
    .then(() => console.log("Bot launched in development mode!"))
    .catch(console.error);
}

// Graceful stop on termination signals
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
