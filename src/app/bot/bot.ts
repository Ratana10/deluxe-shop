import { Markup, Telegraf } from "telegraf";

const BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
const WEB_LINK = "https://0ac4-209-146-61-199.ngrok-free.app/";
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
  ctx.reply("Got your message!");
});

// Handle Reject button click
bot.action("reject_order", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [{ text: "❌ Rejected", callback_data: "confirm_order" }],
    ],
  });

  //Updte the customer's message
  // await ctx.editMessageReplyMarkup({
  //   inline_keyboard: [[{ text: "❌ Rejected", callback_data: "no_action" }]],
  // });

  await bot.telegram.sendMessage(
    USER_CHAT_ID,
    "Your order has been ❌ rejected by the seller!"
  );
});

// Handle Confirm button click
bot.action("confirm_order", async (ctx) => {
  await ctx.answerCbQuery();
  // Update the buttons to show "Confirmed" and disable them
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [{ text: "✅ Confirmed", callback_data: "confirm_order" }],
    ],
  });

  //Updte the customer's message
  // await ctx.editMessageReplyMarkup({
  //   inline_keyboard: [[{ text: "✅ Confirm", callback_data: "no_action" }]],
  // });

  await bot.telegram.sendMessage(
    USER_CHAT_ID,
    "Your order has been ✅ confirmed by the seller!"
  );
});

// Start the bot if it's not already started
if (!bot.botInfo) {
  bot.launch();
}

export default bot;

// bot.on("message", (ctx) => {
//   console.log(`Chat ID: ${ctx.chat.id}`);
//   ctx.reply("Got your message!");
// });

// bot.start((ctx) => {
//   console.log(`Chat ID: ${ctx.chat.id}`);
//   ctx.reply("Got your message!");
// });

// bot.action("order_coffee", (ctx) => {
//   const userId = ctx.from.id;
//   const orderDetails = "1 x Coffee";

//   // Send order confirmation to the user
//   ctx.reply(`Order received: ${orderDetails}`);

//   // Send order details to the seller
//   bot.telegram.sendMessage(
//     RATANA_CHAT_ID,
//     `New order from user ${userId}: ${orderDetails}`
//   );

//   ctx.answerCbQuery(); // Acknowledge the button press
// });

// // Handle Confirm button click
// bot.action("confirm_order", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.editMessageText("✅ Order confirmed by seller.");
// });

// bot.launch();
