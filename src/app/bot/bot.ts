import { Markup, session, Telegraf } from "telegraf";
import dotenv from "dotenv";
import { IOrderStatus } from "@/types/enums";
import dedent from "dedent";
import {
  getOrderById,
  updateOrderStatus,
  updateRejectedReason,
} from "@/service/db/order.service";
import { createUser } from "@/service/db/user.service";
import { IUser } from "@/types";
import { message } from 'telegraf/filters'

// Load environment variables from .env
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_LINK = process.env.NEXT_PUBLIC_API_BASE_URL;
const WEBHOOK_URL = `${WEB_LINK}/api/webhook`;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

console.log("BOT Starting...");

const bot = new Telegraf(BOT_TOKEN);

// Apply session middleware
bot.use(session());

bot.start(async (ctx) => {
  // Simulate typing to make it feel more interactive
  await ctx.sendChatAction("typing");
  await new Promise((resolve) => setTimeout(resolve, 500)); //1000 = Wait 1 second

  const telegrafUser = ctx.from;

  //save user
  const userData: IUser = {
    username: telegrafUser.username,
    firstName: telegrafUser.first_name,
    lastName: telegrafUser.last_name,
    chatId: telegrafUser.id,
  };

  await createUser(userData);

  await ctx.reply(
    `Hello ${telegrafUser.first_name || "there"}! ⭐\nReady to place an order!!`
  );
});
bot.help((ctx) => {
  ctx.reply(
    dedent(`
    Here are the available commands:

    /start - Start interacting with the bot
    /contactus - Contact the shop's owner for support
    /help - Show this help message
    `)
  );
});

bot.command("contactus", async (ctx) => {
  ctx.reply(
    dedent(`
    If you have any problems, 
    please kindly direct message the shop's owner.
    📱 Phone number: 061 664 996
    `),
    Markup.inlineKeyboard([
      [
        Markup.button.url("📸 Instagram", "https://instagram.com/yourprofile"),
        Markup.button.url("💬 Telegram", "https://t.me/chanminea_sarann"),
      ],
    ])
  );
});

bot.action(/confirm_order:(.+):(.+)/, async (ctx) => {
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
    inline_keyboard: [
      [{ text: "🟢 Order Confirm", callback_data: "no_action" }],
    ],
  });

  await bot.telegram.sendMessage(
    chatId!,
    dedent(
      `
      Thank you for placing the orders.
      `
    )
  );

  // Update confirm order
  await updateOrderStatus(orderId, IOrderStatus.CONFIRM);
});

const pendingRejections = new Map();

bot.action(/reject_order:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);

  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [[{ text: "❌ Rejected", callback_data: "reject_order" }]],
  });

  // notify ower write the rejected reason
  await ctx.reply("Please provide a reason for rejecting the order");

  // Save chatId and orderId in pendingRejections for this user
  pendingRejections.set(ctx.from.id, { chatId, orderId });
});

bot.on(message('text'), async (ctx) => {
  // Check if this user has a pending rejection reason
  const rejectionInfo = pendingRejections.get(ctx.from.id);
  if (rejectionInfo) {
    const { chatId, orderId } = rejectionInfo;
    const rejectionReason = ctx.message.text;

    // Remove the pending rejection, so further text inputs don't get linked to this
    pendingRejections.delete(ctx.from.id);

    const { cusMsgId } = await getOrderById(orderId);
    if (!cusMsgId) {
      console.error("cusMsgId", cusMsgId, orderId);
      throw new Error("cusMsgId id not found");
    }

    // Update the customer's order status in their message
    await bot.telegram.editMessageReplyMarkup(chatId, cusMsgId, undefined, {
      inline_keyboard: [[{ text: "🔴 Rejected", callback_data: "no_action" }]],
    });

    // Notify the customer of the rejection and the reason
    await bot.telegram.sendMessage(
      chatId,
      `Your order has been rejected by the shop's owner.\nReason: ${rejectionReason}`
    );

    await updateRejectedReason(orderId, rejectionReason);
    await ctx.reply(
      "Rejection reason recorded and customer has been notified."
    );
  }
});

// Command broadcast
bot.command("broadcast", async (ctx) => {
  const admin = process.env.TELEGRAM_CHAT_ID;

  //Check admin
  if (String(ctx.from.id) === admin) {
    ctx.reply("Broadcasted to all customer");
  } else {
    ctx.reply("Sorry, you are not authorized to use this command.");
  }
});

// bot.action(/pay_bank:(.+):(.+)/, async (ctx) => {
//   const [chatId, orderId] = ctx.match.slice(1);

//   // const imageUrl = `${
//   //   process.env.NEXT_PUBLIC_API_BASE_URL
//   // }/img/aba_qr.jpg?v=${new Date().getTime()}`;

//   const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/aba_qr.jpg`;

//   const order = await getOrderById(orderId);

//   // Simulate typing to make it feel more interactive
//   await ctx.sendChatAction("upload_photo");
//   await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second

//   await ctx.telegram.sendPhoto(chatId, imageUrl, {
//     caption: dedent(`
//         📷 Here is our ABA QR.

//         📝 Please transfer the total amount of $ ${order.total}
//         and send the transaction receipt
//         in this chat once the payment is completed.
//       `),
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "✅ Already paid",
//             callback_data: `confirm_payment:${chatId}:${orderId}`,
//           },
//         ],
//       ],
//     },
//   });
// });

// Stop using
// bot.action(/confirm_payment:(.+):(.+)/, async (ctx) => {
//   const [chatId, orderId] = ctx.match.slice(1);

//   await ctx.reply(`Please send transaction receipt.`);

//   // Set up listener for photo upload
//   bot.on("photo", async (ctx) => {
//     const photoId = ctx.message.photo[0].file_id;

//     await ctx.reply(
//       "Transaction receipt uploaded successfully. We will notify the shop's ower to verify your transaction."
//     );

//     // Update payment status
//     await updateOrderPaymentStatus(orderId, PaymentStatus.AWAITING_VERIIFY);

//     // Send the transaction photo to the seller for verification
//     const owerChatId = process.env.TELEGRAM_CHAT_ID;

//     const order = await getOrderById(orderId);

//     const messsage = dedent(`
//     💵 Total: $${order.total}
//     📦 Order: ${order.orderNumber}
//     A customer has uploaded a transaction receipt for verification
//     `);

//     // Forward the transaction to the shop's ower
//     await ctx.telegram.sendPhoto(owerChatId!, photoId, {
//       caption: messsage,
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "❌ Reject",
//               callback_data: `reject_transaction:${chatId}:${orderId}`,
//             },
//             {
//               text: "✅ Verify",
//               callback_data: `verify_transaction:${chatId}:${orderId}`,
//             },
//           ],
//         ],
//       },
//     });
//   });
// });

// bot.action(/verify_transaction:(.+):(.+)/, async (ctx) => {
//   const [chatId, orderId] = ctx.match.slice(1);

//   // Update button to verify
//   await ctx.editMessageReplyMarkup({
//     inline_keyboard: [
//       [{ text: "✅ Verified", callback_data: "verify_transaction" }],
//     ],
//   });

//   // Find the order in the database
//   await updateOrderPaymentStatus(orderId, PaymentStatus.VERIFIED);

//   // Notify the customer that the payment has been verified
//   await ctx.telegram.sendMessage(
//     chatId,
//     dedent(
//       `
//       Thank you for placing the orders.
//       We would love to inform you that
//       it might take around a half day to 2 days
//       for you to get the items.

//       If you have any problem,
//       Please kindly direct massage to the shop's owner
//       `
//     )
//   );
// });

// Set the webhook only in production and avoid during build
if (process.env.NODE_ENV === "production") {
  process.env.WEBHOOK_URL;
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
