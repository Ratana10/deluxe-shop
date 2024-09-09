import { Markup, Telegraf } from "telegraf";
import { handleConfirmOrder, handleRejectOrder } from "./botAction";
import dotenv from "dotenv";

const BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
const WEB_LINK = "https://de-luxe.vercel.app";
const WEBHOOK_URL = "https://de-luxe.vercel.app/api/webhook";

const TELEGRAM_CHAT_ID = "1042969274";
const USER_CHAT_ID = "7116786291";

const ratanak = "7116786291";
const ratana = "1042969274";

// Load environment variables from .env
dotenv.config();

console.log("BOT TOKEN", BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

console.log("BOT STARTING updateing");

const bot = new Telegraf(BOT_TOKEN);

// bot.telegram.setChatMenuButton({
//   menuButton: {
//     type: "web_app",
//     text: "Order",
//     web_app: {
//       url: WEB_LINK,
//     },
//   },
// });

bot.start(async (ctx) => {
  console.log(`Chat ID: ${ctx.chat.id}`);
  const user = ctx.from;
  console.log("User info:", user);
  const webUrl = `${WEB_LINK}?chat_id=${ctx.chat.id}`;

  bot.telegram.setChatMenuButton({
    menuButton: {
      type: "web_app",
      text: "Order",
      web_app: {
        url: webUrl,
      },
    },
  });

  await ctx.reply(
    "Shopping our website",
    Markup.inlineKeyboard([[Markup.button.url("Shopping", webUrl)]])
  );

  ctx.reply("Bot working!");
});

bot.action(/confirm_order:(.+):(.+)/, async (ctx) => {
  await handleConfirmOrder(ctx);
});

bot.action(/reject_order:(.+):(.+)/, async (ctx) => {
  await handleRejectOrder(ctx);
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
