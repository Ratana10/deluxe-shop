import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "../orderService";

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    const { paymentStatus } = await req.json();

    console.log("payment Status", paymentStatus, orderId);


    const updatedOrder = await updatePaymentStatus(orderId, paymentStatus);


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
