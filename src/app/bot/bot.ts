import { Markup, Telegraf } from "telegraf";

const BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
const WEB_LINK = "https://de-luxe.vercel.app";
const RATANA_CHAT_ID = "1042969274";

console.log("BOT TOKEN", BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setChatMenuButton({
  menuButton: {
    type: "web_app",
    text: "Order",
    web_app: {
      url: WEB_LINK
    }
  }
})

// bot.on("message", (ctx) => {
//   console.log(`Chat ID: ${ctx.chat.id}`);
//   ctx.reply("Got your message!");
// });

bot.action("order_coffee", (ctx) => {
  const userId = ctx.from.id;
  const orderDetails = "1 x Coffee";

  // Send order confirmation to the user
  ctx.reply(`Order received: ${orderDetails}`);

  // Send order details to the seller
  bot.telegram.sendMessage(
    RATANA_CHAT_ID,
    `New order from user ${userId}: ${orderDetails}`
  );

  ctx.answerCbQuery(); // Acknowledge the button press
});

bot.launch();
