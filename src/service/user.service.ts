import { Customer } from "@/types";

export const saveUser = async (user: Customer) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to save user");
    }

    const data = await res.json();
    console.log("data", data);

    return {
      message: data.message,
    };
  } catch (error) {}
};

export const getUserByChatId = (chatId: string) => {
  try {
  } catch (error) {}
};
