"use client";

import React, { useEffect } from "react";
import Hero from "./Hero";
import { useSearchParams } from "next/navigation";

const Client = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat_id");

  useEffect(() => {
    if(chatId){
      console.log('Chat ID from URL params:', chatId)
      localStorage.setItem("chatId", chatId);
    }else{
      console.error('Chat ID not found in URL.');
    }

  }, [chatId]);

  return <Hero />;
};

export default Client;
