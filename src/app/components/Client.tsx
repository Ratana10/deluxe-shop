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

    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = getWebApp();

      tg.ready();

      console.log("have sdk");
    } else {
      console.log("no sdk");
    }
  }, [chatId]);

  return <ProductClient products={products} />;
}
