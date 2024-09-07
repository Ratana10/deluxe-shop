"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
var WEB_LINK = "https://de-luxe.vercel.app";
var RATANA_CHAT_ID = "1042969274";
console.log("BOT TOKEN", BOT_TOKEN);
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
}
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
// Define bot commands
// bot.start((ctx) => ctx.reply("Welcome to the Deluxe Store Bot!"));
bot.help(function (ctx) {
    return ctx.reply("Welcome", {
        reply_markup: {
            keyboard: [[{ text: "web app", web_app: { url: WEB_LINK } }]],
        },
    });
});
// bot.on("message", (ctx) => {
//   console.log(`Chat ID: ${ctx.chat.id}`);
//   ctx.reply("Got your message!");
// });
bot.start(function (ctx) {
    return ctx.reply("Welcome! Click the button below to place an order.", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Order Coffee", "order_coffee"),
    ]));
});
bot.action("order_coffee", function (ctx) {
    var userId = ctx.from.id;
    var orderDetails = "1 x Coffee";
    // Send order confirmation to the user
    ctx.reply("Order received: ".concat(orderDetails));
    // Send order details to the seller
    bot.telegram.sendMessage(RATANA_CHAT_ID, "New order from user ".concat(userId, ": ").concat(orderDetails));
    ctx.answerCbQuery(); // Acknowledge the button press
});
bot.launch();
