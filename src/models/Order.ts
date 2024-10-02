import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums";
import mongoose, { Document, Schema } from "mongoose";
import Counter from "./Counter";

interface OrderDocument extends Document {
  chatId: string;
  orderNumber: string;
  cusMsgId: number;
  orderStatus: OrderStatus;
  deliveryFee: number;
  subtotal: number;
  total: number;
  orderDetails: mongoose.Types.ObjectId[];
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  phoneNumber: string;
  location: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    chatId: { type: String, required: true },
    orderNumber: { type: String, required: false, unique: true },
    cusMsgId: { type: Number, required: false },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.AWAITING_CONFIRM,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    deliveryFee: { type: Number, required: false },
    subtotal: { type: Number, required: false },
    total: { type: Number, required: false },
    phoneNumber: { type: String, required: false },
    location: { type: String, required: false },
    address: { type: String, required: false },
    orderDetails: [{ type: mongoose.Types.ObjectId, ref: "OrderDetail" }],
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
