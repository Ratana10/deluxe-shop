import { getOrderById, updateOrderStatus } from "@/service/order.service";
import bot from "./bot";

export async function handleConfirmOrder(ctx: any) {
  const [userId, orderId] = ctx.match.slice(1);

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
  await bot.telegram.editMessageReplyMarkup(userId, cusMsgId, undefined, {
    inline_keyboard: [[{ text: "🟢 Confirm", callback_data: "no_action" }]],
  });

  await bot.telegram.sendMessage(
    userId,
    "Your order has been Confirmed by the seller! ✅"
  );

  //Update Order Status
  await updateOrderStatus(orderId, "Confirmed")

}

export async function handleRejectOrder(ctx: any) {
  const [userId, orderId] = ctx.match.slice(1);

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
  await bot.telegram.editMessageReplyMarkup(userId, cusMsgId, undefined, {
    inline_keyboard: [[{ text: "🔴 Rejected", callback_data: "no_action" }]],
  });

  await bot.telegram.sendMessage(
    userId,
    "Your order has been Rejected by the seller! ❌"
  );

  //Update Order Status
  await updateOrderStatus(orderId, "Rejected")
}
