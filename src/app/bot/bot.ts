import { Markup, Telegraf } from "telegraf";
import {
  handleConfirmOrder,
  handlePhotoUpload,
  handleRejectOrder,
} from "./botAction";
import dotenv from "dotenv";
import { saveUser } from "@/service/user.service";
import path from "path";

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

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {

  
  // Simulate typing to make it feel more interactive
  await ctx.sendChatAction("typing");
  await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second


  const webUrl = `${WEB_LINK}?chat_id=${ctx.chat.id}`;
  const telegrafUser = ctx.from;

  //save user
  const userData = {
    chatId: ctx.chat.id,
    username: telegrafUser.username || "Unknow",
    firstName: telegrafUser.first_name || "",
    lastName: telegrafUser.last_name || "",
  };


  await saveUser(userData);

  //Personalized Welcome message
  await ctx.reply(
    `សួស្ដី  ${
      telegrafUser.first_name || "there"
    }! ⭐\nReady to place an order!!`,
    Markup.inlineKeyboard([[Markup.button.url("Start Order website", webUrl)]])
  );

  bot.telegram.setChatMenuButton({
    menuButton: {
      type: "web_app",
      text: "Order",
      web_app: {
        url: webUrl,
      },
    },
  });

  // await ctx.reply(
  //   `អ្នកអាច​ Order តាមរយះ Website រឺButton Orderនៅខាងក្រោម ខាងឆ្វេង`
  // );
});

bot.action(/confirm_order:(.+):(.+)/, async (ctx) => {
  await handleConfirmOrder(ctx);
});

bot.action(/reject_order:(.+):(.+)/, async (ctx) => {
  await handleRejectOrder(ctx);
});

bot.action(/pay_delivery:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);
  await ctx.reply(`Thanks you selected delivery`);
});

bot.action(/pay_bank:(.+):(.+)/, async (ctx) => {
  const [chatId, orderId] = ctx.match.slice(1);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/aba_qr.jpg`;

  // Simulate typing to make it feel more interactive
  await ctx.sendChatAction("upload_photo");
  await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second

  await ctx.telegram.sendPhoto(
    chatId,

    imageUrl,

    {
      caption: `នេះជា QR code របស់យើង`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "❌ មិនទាន់បានបង់",
              callback_data: `cancel_payment:${chatId}:${orderId}`,
            },
            {
              text: "✅ បង់រួចហើយ",
              callback_data: `confirm_payment:${chatId}:${orderId}`,
            },
          ],
        ],
      },
    }
  );
});

bot.action(/confirm_payment:(.+):(.+)/, async (ctx) => {
  await ctx.reply(`សូមបងជួយសេន Transaction ដែលបងបានបង់`);
});

bot.on("photo", async (ctx) => {
  if (!TELEGRAM_CHAT_ID) {
    throw new Error("error");
  }

  // await handlePhotoUpload(ctx, TELEGRAM_CHAT_ID);

  const photo = ctx.message.photo.pop();

  if (!photo) {
    throw new Error("Faild to get the file ID");
  }
  const telegrafUser = ctx.from;

  const userData = {
    chatId: ctx.chat.id,
    username: telegrafUser.username || "Unknow",
    firstName: telegrafUser.first_name || "",
    lastName: telegrafUser.last_name || "",
  };

  await ctx.telegram.sendPhoto(TELEGRAM_CHAT_ID, photo?.file_id, {
    caption: `
    New payment receipt received from
    👤 UserDetail
    username: ${userData.username}
    firstname: ${userData.firstName}
    lastname: ${userData.lastName}
    `,
  });

  await ctx.sendMessage(`payment receipt has been received`);
});

//Ask user to share Location
bot.command("location", (ctx) => {
  ctx.reply(
    "Please share your location to procceed with your order",
    Markup.keyboard([Markup.button.locationRequest("📍 Share Location")])
      .oneTime()
      .resize()
  );
});

//Command to ask for the user's phone number
bot.command("phone", (ctx) => {
  ctx.reply(
    "Please share your phone number",
    Markup.keyboard([Markup.button.contactRequest("📱 Share Phone Number")])
      .oneTime()
      .resize()
  );
});

//Hanlde phone number when user share contact
bot.on("contact", (ctx) => {
  const phoneNumber = ctx.message.contact.phone_number;
  console.log("Phone number:", phoneNumber);
  ctx.reply(`Thank you! We received your phone number: ${phoneNumber}`);
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
