import mongoose, { Document, Schema } from "mongoose";


interface OrderDetailDocument extends Document{
  orderId: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

const OrderDetailSchema: Schema = new Schema(
  {
    orderId: { type: mongoose.Types.ObjectId, ref: 'Order', required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);


const OrderDetail =
  mongoose.models.OrderDetail || mongoose.model<OrderDetailDocument>("OrderDetail", OrderDetailSchema);

export default OrderDetail;