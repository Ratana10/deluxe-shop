"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProductClient from "../products/components/ProductClient";
import { Product } from "@/types";
import { getWebApp } from "@/utils/getWebApp";

interface Props {
  products: Product[];
}

export default function Client({ products }: Props) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat_id");

  useEffect(() => {
    if (chatId) {
      localStorage.setItem("chatId", chatId);
    } else {
      // console.error("Chat ID not found in URL.");
    }
    if (typeof window !== "undefined") {
      const tg = getWebApp();

      if (tg) {
        tg.ready();
        console.log("Telegram WebApp SDK is available");
      } else {
        console.log("Telegram WebApp SDK is not available");
      }
    }
  }, [chatId]);

  return <ProductClient products={products} />;
}
