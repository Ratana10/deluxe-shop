import { Markup, Telegraf } from "telegraf";
import { handleConfirmOrder, handleRejectOrder } from "./botAction";
import dotenv from "dotenv";
import { saveUser } from "@/service/user.service";

// Load environment variables from .env
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_LINK = process.env.NEXT_PUBLIC_API_BASE_URL;
const WEBHOOK_URL = `${WEB_LINK}/api/webhook`;

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

console.log("BOT Starting...")

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const webUrl = `${WEB_LINK}?chat_id=${ctx.chat.id}`;
  const telegrafUser = ctx.from;

  //save user
  const userData = {
    chatId: ctx.chat.id,
    username: telegrafUser.username || "",
    firstName: telegrafUser.first_name || "",
    lastName: telegrafUser.last_name || "",
  };

  const result = await saveUser(userData);
  const msg = result?.message || "No msg";
  console.log(msg);

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
    `Let's get Order ⭐`,
    Markup.inlineKeyboard([[Markup.button.url("Order", webUrl)]])
  );
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
