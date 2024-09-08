"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var OrderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    cusMsgId: { type: Number, required: false },
    status: { type: String, default: "Pending" },
    total: { type: Number, required: false },
    orderDetails: [{ type: mongoose_1.default.Types.ObjectId, ref: "OrderDetail" }],
}, {
    timestamps: true,
});
var Order = mongoose_1.default.models.Order || mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
