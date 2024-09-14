import { getOrderById, updateOrderStatus } from "@/service/order.service";
import bot from "./bot";
import { Context, Markup } from "telegraf";
import path from "path";
import fs from "fs";
import { OrderStatus } from "@/types/enums";

export async function handleConfirmOrder(ctx: any) {
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
    inline_keyboard: [[{ text: "🟢 Confirm", callback_data: "no_action" }]],
  });

  // await bot.telegram.sendMessage(
  //   chatId,
  //   "Your order has been Confirmed by the seller! ✅"
  // );

  await bot.telegram.sendMessage(
    chatId!, // Customer's Telegram chat ID
    `បងចង់ pay ប្រាក់តាមរបៀបណា`,
    Markup.inlineKeyboard([
      [
        {
          text: "🚚 Pay via Delivery",
          callback_data: `pay_delivery:${chatId}:${orderId}`,
        },
        {
          text: "🏦 Pay via Bank",
          callback_data: `pay_bank:${chatId}:${orderId}`,
        },
      ],
    ])
  );

  //Update Order Status
  await updateOrderStatus(orderId, OrderStatus.CONFIRMED);
}

export async function handleRejectOrder(ctx: any) {
  const [chatId, orderId] = ctx.match.slice(1);

  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [[{ text: "❌ Rejected", callback_data: "reject_order" }]],
  });

  const { cusMsgId } = await getOrderById(orderId);

  if (!cusMsgId) {
    console.error("cusMsgId", cusMsgId, orderId);
    throw new Error("cusMsgId id not found");
  }

  //update customer chat Pending to Confirm
  await bot.telegram.editMessageReplyMarkup(chatId, cusMsgId, undefined, {
    inline_keyboard: [[{ text: "🔴 Rejected", callback_data: "no_action" }]],
  });

  await bot.telegram.sendMessage(
    chatId,
    "Your order has been Rejected by the seller! ❌"
  );

  //Update Order Status
  await updateOrderStatus(orderId, OrderStatus.REJECTED);
}

export async function handlePhotoUpload(ctx: any, sellerChatId: string) {
  try {
    const photo = ctx.message.photo.pop();

    const fileId = photo?.file_id;

    if (!fileId) {
      throw new Error("Faild to get the file ID");
    }

    const fileUrl = await ctx.telegram.getFileLink(fileId);

    //Define the file name and path
    // const fileName = `${fileId}.jpg`;

    // const filePath = path.resolve(__dirname, fileName);

    //Download the image using the fetch API
    const res = await fetch(fileUrl.href);

    if (!res.ok) {
      throw new Error(
        `Failed to download image from Telegram: ${res.statusText}}`
      );
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    //Forward the image to the seller after saving
    await ctx.telegram.sendPhoto(
      sellerChatId,
      { source: buffer },
      {
        caption: `New transaction receipt from username: ${ctx.message?.from?.first_name}`,
      }
    );
  } catch (error) {
    console.error("Error handling photo:", error);
    await ctx.reply(
      "There was an error processing your image. Please try again."
    );
  }
}

export const handlePaymentQr = () => {};
