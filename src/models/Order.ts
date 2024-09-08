import mongoose, { Document, Schema } from "mongoose";

interface OrderDocument extends Document {
  userId: string;
  cusMsgId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    cusMsgId: { type: Number, required: false },
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
