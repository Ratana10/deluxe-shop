import mongoose, { Document, Schema } from "mongoose";

interface OrderDocument extends Document {
  userId: string;
  cusMsgId: number;
  status: string;
  total: number;
  orderDetails: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    cusMsgId: { type: Number, required: false },
    status: { type: String, default: "Pending" },
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
