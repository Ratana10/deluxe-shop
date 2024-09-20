export enum PaymentStatus {
  PENDING = "Pending",
  AWAITING_VERIFICATION = "Awaiting Verification",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
  CANCELED = "Canceled",
}

export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  REJECTED = "Rejected",
}


export enum OrderStep{
  AWATING_CONFIRM ="Awaiting_confirm",
  AWAITING_PHONE = "Awaiting_phone",
  AWAITING_LOCATION = "Awaiting_location",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
}