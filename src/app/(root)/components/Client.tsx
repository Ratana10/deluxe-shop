"use client";

import React, { useEffect } from "react";
import Hero from "./Hero";
import { useSearchParams } from "next/navigation";

const Client = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat_id");

  useEffect(() => {
    // Check if the Telegram WebApp API is available
    if (window.Telegram && window.Telegram.WebApp) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;

      // Check if chatId exists in Telegram's initDataUnsafe
      if (user?.id) {
        const chatId = user.id.toString(); // Convert chatId to string
        console.log("chat id", chatId);
        localStorage.setItem("chatId", chatId); // Store chatId in localStorage
      } else {
        console.error("Chat ID not available.");
      }
    }
  }, []); // Empty dependency array to run only once when the component mounts

  return <Hero />;
};

export default Client;
