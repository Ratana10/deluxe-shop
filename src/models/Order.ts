import { OrderStatus, PaymentStatus } from "@/types/enums";
import mongoose, { Document, Schema } from "mongoose";

interface OrderDocument extends Document {
  chatId: string;
  cusMsgId: number;
  orderStatus: OrderStatus;
  total: number;
  orderDetails: mongoose.Types.ObjectId[];
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    chatId: { type: String, required: true },
    cusMsgId: { type: Number, required: false },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    total: { type: Number, required: false },
    orderDetails: [{ type: mongoose.Types.ObjectId, ref: "OrderDetail" }],
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
