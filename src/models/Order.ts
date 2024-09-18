import { OrderStatus, PaymentStatus } from "@/types/enums";
import mongoose, { Document, Schema } from "mongoose";
import Counter from "./Counter";

interface OrderDocument extends Document {
  chatId: string;
  orderNumber: string;
  cusMsgId: number;
  orderStatus: OrderStatus;
  total: number;
  orderDetails: mongoose.Types.ObjectId[];
  paymentStatus: PaymentStatus;
  phoneNumber: string;
  location: string;
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
      default: OrderStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    total: { type: Number, required: false },
    phoneNumber: { type: String, required: false },
    location: { type: String, required: false },
    orderDetails: [{ type: mongoose.Types.ObjectId, ref: "OrderDetail" }],
  },
  {
    timestamps: true,
  }
);

// Presave hook to auto increment order number
OrderSchema.pre<OrderDocument>("save", async function (next) {
  const order = this;

  //generate the order number
  if (order.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "orderNumber" }, // Find the counter document by name
      { $inc: { seq: 1 } }, // Increment the sequence number
      { new: true, upsert: true } // Create a new counter if it doesn't exist
    );

    const seq = counter.seq;
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // e.g., 202409 for Sept 2024
    order.orderNumber = `DELUXE${yearMonth}${String(seq).padStart(4, "0")}`; // e.g., DELUXE202409001
  }
  next();
});

const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
