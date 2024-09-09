import { Markup, Telegraf } from "telegraf";
import { handleConfirmOrder, handleRejectOrder } from "./botAction";

const BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
const WEB_LINK = "https://de-luxe.vercel.app";
const TELEGRAM_CHAT_ID = "1042969274";
const USER_CHAT_ID = "7116786291";

const ratanak = "7116786291";
const ratana = "1042969274";

console.log("BOT TOKEN", BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

console.log("BOT STARTING updateing");

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setChatMenuButton({
  menuButton: {
    type: "web_app",
    text: "Order",
    web_app: {
      url: WEB_LINK,
    },
  },
});

bot.start(async (ctx) => {
  console.log(`Chat ID: ${ctx.chat.id}`);
  const user = ctx.from;
  console.log("User info:", user);
  const webUrl = `${WEB_LINK}?chat_id=${ctx.chat.id}`;

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

// Start the bot if it's not already started
if (!bot.botInfo) {
  bot
    .launch()
    .then(() => console.log("Bot launched!"))
    .catch(console.error);
}

// Graceful stop on termination signals
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
