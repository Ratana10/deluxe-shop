import { updateOrderPaymentStatus } from "@/service/db/order.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    const { paymentStatus } = await req.json();

    const updatedOrder = await updateOrderPaymentStatus(orderId, paymentStatus);

    return NextResponse.json(
      { message: "Payment status updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
