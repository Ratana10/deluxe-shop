import mongoose, { Schema, Document } from "mongoose";

// Counter Schema to keep track of the order sequence
const counterSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }, // Name of the counter (e.g., "orderNumber")
  seq: { type: Number, default: 1 }                    // Sequence number for auto-increment
});

// Create or retrieve the Counter model
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default Counter;
