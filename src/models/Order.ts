import { IOrderStatus, IPaymentMethod, IPaymentStatus } from "@/types/enums";
import mongoose, { Document, Schema } from "mongoose";

interface OrderDocument extends Document {
  chatId: string;
  orderNumber: string;
  cusMsgId: number;
  orderStatus: IOrderStatus;
  deliveryFee: number;
  subtotal: number;
  total: number;
  orderDetails: mongoose.Types.ObjectId[];
  paymentMethod: IPaymentMethod;
  paymentStatus: IPaymentStatus;
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
      enum: Object.values(IOrderStatus),
      default: IOrderStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(IPaymentStatus),
      default: IPaymentStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(IPaymentMethod),
      default: IPaymentMethod.DELIVERY,
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
