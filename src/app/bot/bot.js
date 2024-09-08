"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var BOT_TOKEN = "7313219020:AAF78Gg952D3td9LMPw7HsvsIFf_Vls8EmY";
var WEB_LINK = "https://0ac4-209-146-61-199.ngrok-free.app/";
var TELEGRAM_CHAT_ID = "1042969274";
var USER_CHAT_ID = "7116786291";
var ratanak = "7116786291";
var ratana = "1042969274";
console.log("BOT TOKEN", BOT_TOKEN);
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
}
console.log("BOT STARTING updateing");
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.telegram.setChatMenuButton({
    menuButton: {
        type: "web_app",
        text: "Order",
        web_app: {
            url: WEB_LINK,
        },
    },
});
bot.start(function (ctx) {
    console.log("Chat ID: ".concat(ctx.chat.id));
    ctx.reply("Got your message!");
});
// Handle Reject button click
bot.action("reject_order", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery()];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: "❌ Rejected", callback_data: "confirm_order" }],
                        ],
                    })];
            case 2:
                _a.sent();
                //Updte the customer's message
                // await ctx.editMessageReplyMarkup({
                //   inline_keyboard: [[{ text: "❌ Rejected", callback_data: "no_action" }]],
                // });
                return [4 /*yield*/, bot.telegram.sendMessage(USER_CHAT_ID, "Your order has been ❌ rejected by the seller!")];
            case 3:
                //Updte the customer's message
                // await ctx.editMessageReplyMarkup({
                //   inline_keyboard: [[{ text: "❌ Rejected", callback_data: "no_action" }]],
                // });
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Handle Confirm button click
bot.action("confirm_order", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery()];
            case 1:
                _a.sent();
                // Update the buttons to show "Confirmed" and disable them
                return [4 /*yield*/, ctx.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{ text: "✅ Confirmed", callback_data: "confirm_order" }],
                        ],
                    })];
            case 2:
                // Update the buttons to show "Confirmed" and disable them
                _a.sent();
                //Updte the customer's message
                // await ctx.editMessageReplyMarkup({
                //   inline_keyboard: [[{ text: "✅ Confirm", callback_data: "no_action" }]],
                // });
                return [4 /*yield*/, bot.telegram.sendMessage(USER_CHAT_ID, "Your order has been ✅ confirmed by the seller!")];
            case 3:
                //Updte the customer's message
                // await ctx.editMessageReplyMarkup({
                //   inline_keyboard: [[{ text: "✅ Confirm", callback_data: "no_action" }]],
                // });
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Start the bot if it's not already started
if (!bot.botInfo) {
    bot.launch();
}
exports.default = bot;
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
