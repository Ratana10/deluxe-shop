"use client";

import React, { useEffect } from "react";
import Hero from "./Hero";
import { useSearchParams } from "next/navigation";

const Client = () => {
  const searchParams = useSearchParams();
  const chatIdFromParams = searchParams.get("chat_id");
  let testChatId : string | null = "";

  useEffect(() => {
    // Function to get chatId from Telegram WebApp API
    const getTelegramChatId = (): string | null => {
      if (window.Telegram && window.Telegram.WebApp) {
        const { user } = window.Telegram.WebApp.initDataUnsafe;

        if (user?.id) {
          const chatId = user.id.toString();
          console.log("Telegram WebApp chat id:", chatId);
          return chatId;
        }
      }
      console.error("Telegram WebApp is not available or chat_id is missing.");
      return null;
    };

    // Check if chatId exists in searchParams
    if (chatIdFromParams) {
      console.log("Chat ID from search params:", chatIdFromParams);
      localStorage.setItem("chatId", chatIdFromParams); // Store chatId from search params
    } else {
      // If no chatId in searchParams, use Telegram WebApp API
      const telegramChatId = getTelegramChatId();
      if (telegramChatId) {
        localStorage.setItem("chatId", telegramChatId); // Store chatId from Telegram WebApp API
      }
    }

    testChatId = localStorage.getItem("chatId");
  }, [chatIdFromParams]);

  // return <Hero />;
  return (
    <>
      <h1 className="mt-16 text-3xl">Your chat id ${testChatId}</h1>
    </>
  );
};

export default Client;
