import { connectMongoDB } from "../../lib/mongodb";
import Order from "../../models/Order";
import { Markup, Telegraf } from "telegraf";
import { handleConfirmOrder, handleRejectOrder } from "./botAction";

const BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
const WEB_LINK = "https://4baa-209-146-61-199.ngrok-free.app/";
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

bot.start((ctx) => {
  console.log(`Chat ID: ${ctx.chat.id}`);
  ctx.reply("Bot working!");
});

bot.action(/confirm_order:(.+):(.+)/, async (ctx) => {
  await handleConfirmOrder(ctx);
});

bot.action(/reject_order:(.+):(.+)/, async (ctx) => {
  await handleRejectOrder(ctx);
});

// Start the bot if it's not already started
if (!bot.botInfo) {
  bot.launch();
}

export default bot;
