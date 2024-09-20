export enum PaymentStatus {
  PENDING = "Pending",
  AWAITING_VERIIFY = "Awaiting_verify", // Customer has send the transaction
  VERIFIED = "Verified", // Owner has verified the transaction
  REJECTED = "Rejected", // Ower has rejected the payment
}

export enum OrderStatus { 
  AWAITING_CONFIRM = "Awaiting_confirm",  // Wait owner confirm the order
  AWAITING_PHONE = "Awaiting_phone", // Wait customer send the phone number
  AWAITING_LOCATION = "Awaiting_location", // Waiting customer send the location
  AWAITING_DELIVERY = "Awaiting_delivery",  // Customer waiting the product
  COMPLETED = "Completed",  // Customer received the product ordered
  REJECTED = "Rejected", // Ower rejected the the product ordered
}
