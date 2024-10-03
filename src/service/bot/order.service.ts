import { PaymentStatus } from "@/types/enums";

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update order");
    }

    const data = await res.json();

    return {
      message: data.message,
      order: data.order,
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return {
      message: "Failed to update payment status",
    };
  }
};

export const getUserByChatId = (chatId: string) => {
  try {
  } catch (error) {}
};


