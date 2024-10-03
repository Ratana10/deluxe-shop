import { formatInTimeZone } from "date-fns-tz";

export const formattedDate = (currentDate: Date) => {
  const timeZone = "Asia/Phnom_Penh";
  return formatInTimeZone(currentDate, timeZone, "dd-MM-yyyy hh:mm a");
};
