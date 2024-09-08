"use client";

import React, { useEffect } from "react";
import Hero from "./Hero";
import { useSearchParams } from "next/navigation";

const Client = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat_id");

  useEffect(() => {
    if (chatId) {
      console.log("chat id", chatId);
      localStorage.setItem("chatId", chatId);
    }
  }, [chatId]);

  return <Hero />;
};

export default Client;
